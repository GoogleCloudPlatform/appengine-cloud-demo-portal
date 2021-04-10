import NextImage, { ImageProps } from "next/image";

type Props = Omit<
  ImageProps,
  "quality" | "priority" | "unoptimized" | "objectFit" | "objectPosition"
> & {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
};

const Image: React.FC<Props> = (props) => (
  <NextImage {...props} unoptimized={true} />
);

export default Image;
