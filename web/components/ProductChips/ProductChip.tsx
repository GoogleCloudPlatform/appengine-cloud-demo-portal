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

import {
  Avatar,
  Chip,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";

import { useTranslation } from "../../hooks/useTranslation";
import products from "./products";

type Props = {
  productId: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      backgroundColor: theme.palette.background.paper,
    },
  })
);

const ProductChip: React.FC<Props> = ({ productId }) => {
  const classes = useStyles();
  const { locale } = useTranslation();
  const product = products[productId];

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    window.open(`${product.url}?hl=${locale}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Chip
      label={product.name}
      variant="outlined"
      avatar={<Avatar alt={product.name} src={product.icon} />}
      onClick={onClick}
      className={classes.chip}
    />
  );
};

export default ProductChip;
