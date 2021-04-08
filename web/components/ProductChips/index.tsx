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
