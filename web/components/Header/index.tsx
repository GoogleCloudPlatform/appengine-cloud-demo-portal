import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GitHub } from "@material-ui/icons";

import { useTranslation } from "../../hooks/useTranslation";
import LangMenu from "./LangMenu";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  })
);

const GlobalNavigation: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <header>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
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

export default GlobalNavigation;
