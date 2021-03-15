import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

import ProductChips from "../../components/ProductChips";
import { useTranslation } from "../../hooks/useTranslation";
import { demos } from "../../src/demos";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    description: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
    },
  })
);

const demo = demos["contactCenterAnalysis"];

const ContactCenterAnalysis: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <main className={classes.root}>
      <Typography variant="h3" component="h2" className={classes.title}>
        {t.contactCenterAnalysis.title}
      </Typography>
      <ProductChips productIds={demo.products} />
      <Typography
        variant="subtitle1"
        component="p"
        className={classes.description}
      >
        {t.contactCenterAnalysis.description}
      </Typography>
    </main>
  );
};

export default ContactCenterAnalysis;
