import {
  Avatar,
  Chip,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useTranslation } from "../../hooks/useTranslation";

type Product = {
  name: string;
  icon: string;
  url: string;
};

const products: { [key: string]: Product } = {
  "speech-to-text": {
    name: "Cloud Speech-to-Text",
    icon: "/images/speech-to-text-512-color.svg",
    url: "https://cloud.google.com/speech-to-text",
  },
  "natural-language-api": {
    name: "Cloud Natural Language API",
    icon: "/images/cloud-natural-language-api-512-color.svg",
    url: "https://cloud.google.com/natural-language",
  },
  "translation-api": {
    name: "Cloud Translation API",
    icon: "/images/cloud-translation-api-512-color.svg",
    url: "https://cloud.google.com/translate",
  },
};

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
    window.open(`${product.url}?hl=${locale}`, "_blank");
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
