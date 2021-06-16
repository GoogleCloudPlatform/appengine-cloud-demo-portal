/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
