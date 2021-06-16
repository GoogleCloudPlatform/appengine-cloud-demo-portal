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

import { createStyles, makeStyles, Theme } from "@material-ui/core";

import ProductChip from "./ProductChip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
  })
);

type Props = {
  productIds: string[];
};

const ProductChips: React.FC<Props> = ({ productIds }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {productIds.map((id) => (
        <ProductChip productId={id} key={id} />
      ))}
    </div>
  );
};

export default ProductChips;
