//import { prependPublicDomain, prependStorageDomain } from "../code/utils";
interface IProps {
  src: string;
  alt: string;
  title?: string;
  id?: string;
  width?: number;
  height?: number;
  className?: string;
  draggable?: boolean;
  onClick?: (e: any) => void;
}

const loader = ({ src }: any) => {
  const lowered = src.toLowerCase();
  // We use includes here instead of startsWith because the url might look like: "blob:http://mydomain/{identifier}"
  if (lowered.includes("https://") || lowered.includes("http://")) {
    return src;
  } else {
    // TODO
    return src;
    // if (
    //   !lowered.startsWith("___/website/") &&
    //   !lowered.startsWith("system/temp/")
    // ) {
    //   return prependPublicDomain(src);
    // } else {
    //   return prependStorageDomain(src);
    // }
  }
};

export function Image({
  src,
  alt,
  id,
  width,
  height,
  className,
  draggable,
  title,
  onClick,
}: IProps) {
  if (!src || typeof src !== "string") {
    return null;
  }

  return (
    <img
      src={loader({ src, width })}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      draggable={draggable}
      id={id}
    />
  );
}
