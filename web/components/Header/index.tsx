import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { GitHub } from "@material-ui/icons";
import { useRouter } from "next/router";

import { useTranslation } from "../../hooks/useTranslation";
import LangMenu from "./LangMenu";

const useStyles = makeStyles(() =>
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
  const { t } = useTranslation();

  const onClickTitle = () => router.push("/", "/");

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
            {/*
            <IconButton
              aria-label="github"
              color="inherit"
              href="https://github.com/nownabe/cloud-demos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </IconButton>
            */}
          </nav>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
