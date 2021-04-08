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
