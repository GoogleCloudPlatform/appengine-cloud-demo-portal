import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

import ProductChips from "../../components/ProductChips";
import { useTranslation } from "../../hooks/useTranslation";
import { demos } from "../../src/demos";
import Recorder from "../../components/Recorder";

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

  const languages = ["en-US", "ja-JP"];

  const onStop = async (lang: string, blob: Blob): Promise<void> => {
    console.log("onStop", lang, blob.size);
    await fetch("https://google.com");
  };

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
      <Recorder onStop={onStop} languages={languages} defaultLanguage="en-US" />
    </main>
  );
};

export default ContactCenterAnalysis;
