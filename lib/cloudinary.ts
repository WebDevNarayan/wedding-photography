import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    `Missing Cloudinary env vars: ${[
      !cloudName && "CLOUDINARY_CLOUD_NAME",
      !apiKey && "CLOUDINARY_API_KEY",
      !apiSecret && "CLOUDINARY_API_SECRET",
    ]
      .filter(Boolean)
      .join(", ")}`
  );
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

type UploadResult = {
  url: string;
  blurDataUrl: string;
};

export async function uploadImage(
  file: File | Buffer,
  folder: string
): Promise<UploadResult> {
  const buffer =
    file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error instanceof Error ? error : new Error(error?.message ?? "Upload failed"));

        const blurDataUrl = cloudinary.url(result.public_id, {
          transformation: [
            { width: 10, effect: "blur:1000", quality: "auto", fetch_format: "webp" },
          ],
          sign_url: false,
        });

        resolve({ url: result.secure_url, blurDataUrl });
      }
    );

    stream.end(buffer);
  });
}
