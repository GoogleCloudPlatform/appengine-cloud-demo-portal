import {
  createStyles,
  makeStyles,
  Theme,
  Link,
  Container,
} from "@material-ui/core";
import { GitHub } from "@material-ui/icons";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      textAlign: "center",
    },
  })
);

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <Container maxWidth="sm" className={classes.container}>
        <Link href="https://github.com/ShawnLabo/cloud-demos">
          <GitHub style={{ color: "black" }} fontSize="large" />
        </Link>
      </Container>
    </footer>
  );
};

export default Footer;
