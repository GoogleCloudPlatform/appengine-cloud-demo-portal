import { createStyles, makeStyles, Tab, Tabs, Theme } from "@material-ui/core";

import { useTab } from "../hooks/useTab";
import Api from "./Api";
import Dispatch from "./Dispatch";
import Web from "./Web";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      marginBottom: theme.spacing(2),
    },
  })
);

const GettingStarted: React.FC = () => {
  const classes = useStyles();
  const { value, onChange } = useTab();

  return (
    <>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        value={value}
        onChange={onChange}
        className={classes.tabs}
      >
        <Tab label="web" />
        <Tab label="api" />
        <Tab label="dispatch" />
      </Tabs>
      <Web hidden={value !== 0} />
      <Api hidden={value !== 1} />
      <Dispatch hidden={value !== 2} />
    </>
  );
};

export default GettingStarted;
