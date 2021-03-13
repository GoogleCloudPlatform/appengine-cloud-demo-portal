import {
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { HeadsetMic } from "@material-ui/icons";

import { useTranslation } from "../../hooks/useTranslation";

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
  })
);

type Props = void;

const GlobalNavigation: React.FC<Props> = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <header>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {t.title}
            </Typography>
          </Toolbar>
        </AppBar>
      </header>
      <nav>
        <Drawer
          anchor="left"
          variant="permanent"
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <HeadsetMic />
                </ListItemIcon>
                <ListItemText primary={t.contactCenterAnalysis.title} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </nav>
    </>
  );
};

export default GlobalNavigation;
