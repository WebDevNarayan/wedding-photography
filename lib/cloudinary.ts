import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        if (error || !result) return reject(error ?? new Error("Upload failed"));

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
