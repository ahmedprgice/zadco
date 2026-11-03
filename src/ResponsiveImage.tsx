import { useState, type ImgHTMLAttributes } from "react";
import manifest from "./optimized-images.json";

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;
type OptimizedImage = { width: number; height: number; variants: { src: string; width: number }[] };
const images: Record<string, OptimizedImage> = manifest;

export default function ResponsiveImage(props: ImageProps) {
  return <ImageWithFeedback key={props.src} {...props} />;
}

function ImageWithFeedback({ src, sizes, className = "", onLoad, onError, ...props }: ImageProps) {
  const [status, setStatus] = useState("pending");
  const optimized = src ? images[src] : undefined;
  return <img
    {...props}
    src={optimized?.variants.slice(-1)[0]?.src ?? src}
    srcSet={optimized?.variants.map(image => `${image.src} ${image.width}w`).join(", ")}
    sizes={optimized ? sizes ?? "(max-width: 700px) calc(100vw - 32px), (max-width: 1023px) 50vw, 420px" : sizes}
    width={props.width ?? optimized?.width}
    height={props.height ?? optimized?.height}
    decoding={props.decoding ?? "async"}
    className={`responsive-image ${className}`}
    data-image-status={status}
    ref={image => {
      if (image?.complete) setStatus(image.naturalWidth > 0 ? "loaded" : "error");
    }}
    onLoad={event => { setStatus("loaded"); onLoad?.(event); }}
    onError={event => { setStatus("error"); onError?.(event); }}
  />;
}
