import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GitHub } from "@material-ui/icons";
import { useState } from "react";

import { useTranslation } from "../../hooks/useTranslation";

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

  const [
    anchorDemoMenuButton,
    setAnchorDemoMenuButton,
  ] = useState<null | HTMLElement>(null);

  const onClickDemoMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorDemoMenuButton(event.currentTarget);

  const onCloseDemoMenu = () => setAnchorDemoMenuButton(null);

  return (
    <header>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {t.title}
          </Typography>
          <nav>
            <Button
              color="inherit"
              aria-controls="demo-menu"
              aria-haspopup="true"
              onClick={onClickDemoMenu}
            >
              {t.demoMenu}
            </Button>
            <Menu
              id="demo-menu"
              anchorEl={anchorDemoMenuButton}
              keepMounted
              open={Boolean(anchorDemoMenuButton)}
              onClose={onCloseDemoMenu}
            >
              <MenuItem onClick={onCloseDemoMenu}>
                {t.contactCenterAnalysis.title}
              </MenuItem>
            </Menu>
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
