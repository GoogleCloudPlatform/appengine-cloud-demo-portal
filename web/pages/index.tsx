import Head from "next/head";
import Image from "next/image";
import {
  ButtonBase,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";

import { useTranslation } from "../hooks/useTranslation";
import ProductChips from "../components/ProductChips";

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
    paper: {
      cursor: "pointer",
      padding: theme.spacing(2),
      textAlign: "left",
    },
    demoTitle: {
      fontSize: "1.5rem",
    },
    demoIcon: {
      borderRadius: "10%",
    },
  })
);

const Index: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation();

  const demos = [
    {
      path: "/contactCenterAnalysis",
      title: t.contactCenterAnalysis.title,
      description: t.contactCenterAnalysis.description,
      products: ["speech-to-text", "natural-language-api"],
    },
    {
      path: "/contactCenterAnalysis2",
      title: t.contactCenterAnalysis.title,
      description: t.contactCenterAnalysis.description,
      products: ["speech-to-text", "natural-language-api"],
    },
    {
      path: "/contactCenterAnalysis3",
      title: t.contactCenterAnalysis.title,
      description: t.contactCenterAnalysis.description,
      products: ["speech-to-text", "natural-language-api"],
    },
    {
      path: "/contactCenterAnalysis4",
      title: t.contactCenterAnalysis.title,
      description: t.contactCenterAnalysis.description,
      products: ["speech-to-text", "natural-language-api"],
    },
  ];

  const [onPaperHovered, setOnPaperHovered] = useState<{
    [key: string]: boolean;
  }>(
    demos.reduce((initial: { [key: string]: boolean }, demo) => {
      initial[demo.path] = false;
      return initial;
    }, {})
  );

  const onClick = (path: string) => () => router.push(path, path);
  const onMouseEnter = (path: string) => () => {
    setOnPaperHovered((state) => ({ ...state, [path]: true }));
  };
  const onMouseLeave = (path: string) => () => {
    setOnPaperHovered((state) => ({ ...state, [path]: false }));
  };

  return (
    <main className={classes.root}>
      <Head>
        <title>{t.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid
        container
        spacing={3}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        {demos.map((demo) => (
          <Grid item key={demo.path} md={6} sm={12} xs={12}>
            <ButtonBase focusRipple>
              <Paper
                className={classes.paper}
                onClick={onClick(demo.path)}
                onMouseEnter={onMouseEnter(demo.path)}
                onMouseLeave={onMouseLeave(demo.path)}
                elevation={onPaperHovered[demo.path] ? 5 : 1}
              >
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item xs={3}>
                    <Image
                      src={`/images${demo.path}.jpg`}
                      alt={demo.title}
                      width={128}
                      height={128}
                      className={classes.demoIcon}
                    ></Image>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid
                      container
                      direction="column"
                      justify="flex-start"
                      alignItems="flex-start"
                      spacing={1}
                    >
                      <Grid item>
                        <Typography
                          className={classes.demoTitle}
                          component="h2"
                          variant="h2"
                        >
                          {demo.title}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" component="p">
                          {demo.description}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <ProductChips productIds={demo.products} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </main>
  );
};

export default Index;
