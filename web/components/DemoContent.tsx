import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: { padding: theme.spacing(4) },
  })
);

const DemoContent: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid item>
      <Paper className={classes.panel}>{children}</Paper>
    </Grid>
  );
};

export default DemoContent;
