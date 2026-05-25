import Image, { type ImageProps } from "next/image";

type BlurImageProps = ImageProps & {
  blurDataUrl?: string;
};

export function BlurImage({ blurDataUrl, alt, ...props }: BlurImageProps) {
  if (blurDataUrl) {
    return (
      <Image
        alt={alt}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        {...props}
      />
    );
  }
  return <Image alt={alt} {...props} />;
}
