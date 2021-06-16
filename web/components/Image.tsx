/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
