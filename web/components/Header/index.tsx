import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GitHub } from "@material-ui/icons";
import { useRouter } from "next/router";

import { useTranslation } from "../../hooks/useTranslation";
import LangMenu from "./LangMenu";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
      cursor: "pointer",
    },
  })
);

const Header: React.FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const { t, locale } = useTranslation();

  const onClickTitle = () => router.push("/", "/", { locale });

  return (
    <header>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={onClickTitle}
          >
            {t.title}
          </Typography>
          <nav>
            <LangMenu />
            <IconButton
              aria-label="github"
              color="inherit"
              href="https://github.com/ShawnLabo/cloud-demos"
              target="_blank"
            >
              <GitHub />
            </IconButton>
          </nav>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
