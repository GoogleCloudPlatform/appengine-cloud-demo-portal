import {
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Popover,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Help } from "@material-ui/icons";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 800,
      padding: theme.spacing(2),
    },
    list: {
      paddingInlineStart: theme.spacing(4),
    },
  })
);

type Props = {
  instructions: string[];
};

const HelpButton: React.FC<Props> = ({ instructions }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [anchor, setAnchor] = useState<HTMLAnchorElement | null>(null);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
    setAnchor(event.currentTarget);

  const onClose = () => setAnchor(null);

  const open = Boolean(anchor);

  const randomId = Math.random().toString(32).substring(2);
  const id = open ? `help-button-${randomId}` : undefined;

  return (
    <>
      <Tooltip title={t.howToUse} placement="top">
        <IconButton
          aria-describedby={id}
          onClick={onClick}
          color="default"
          aria-label="help"
          component="span"
        >
          <Help />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchor}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Paper className={classes.container}>
          <ul className={classes.list}>
            {instructions.map((ins, i) => (
              <Typography key={i} variant="body1" component="li">
                {ins}
              </Typography>
            ))}
          </ul>
        </Paper>
      </Popover>
    </>
  );
};

export default HelpButton;
