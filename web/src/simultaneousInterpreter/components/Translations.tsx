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
  Box,
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogTitle,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingRight: theme.spacing(4),
      height: "100%",
    },
    selectorButton: {
      marginBottom: theme.spacing(2),
    },
    selector: {
      padding: theme.spacing(4),
    },
    language: {
      borderBottom: `2px solid ${theme.palette.divider}`,
      paddingBottom: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

type Props = {
  translations: { [key: string]: string[] };
};

const Translations: React.FC<Props> = ({ translations }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [selectedLanguages, setSelectedLanguages] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    setSelectedLanguages((state) => {
      const nextState: { [key: string]: boolean } = {};

      Object.keys(translations).forEach((lang) => {
        if (lang in state) {
          nextState[lang] = state[lang];
        } else {
          nextState[lang] = true;
        }
      });

      return nextState;
    });
  }, [translations]);

  const unselectAll = () => {
    setSelectedLanguages((state) => {
      const nextState: { [key: string]: boolean } = {};

      Object.keys(state).forEach((lang) => {
        nextState[lang] = false;
      });

      return nextState;
    });
  };

  const languages = useMemo(() => Object.keys(translations), [translations]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleLanguage = (lang: string) => () => {
    setSelectedLanguages((state) => ({
      ...state,
      [lang]: !state[lang],
    }));
  };

  return (
    <Box component="div" overflow="scroll" className={classes.root}>
      <Grid container direction="column">
        <Grid item className={classes.selectorButton}>
          <Button
            onClick={handleOpen}
            variant="contained"
            color="primary"
            disabled={languages.length === 0}
          >
            {t.simultaneousInterpreter.selectLanguages}
          </Button>
          <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
              {t.simultaneousInterpreter.selectLanguagesTitle}
            </DialogTitle>
            <Paper className={classes.selector}>
              <Button onClick={unselectAll} variant="contained">
                {t.simultaneousInterpreter.unselectAll}
              </Button>
              <br />
              {languages.map((lang) =>
                lang in selectedLanguages ? (
                  <FormControlLabel
                    key={lang}
                    control={
                      <Checkbox
                        checked={selectedLanguages[lang]}
                        onChange={toggleLanguage(lang)}
                        color="primary"
                      />
                    }
                    label={lang}
                  />
                ) : null
              )}
            </Paper>
          </Dialog>
        </Grid>
        {languages.map((lang) =>
          selectedLanguages[lang] ? (
            <Grid item key={lang} className={classes.language}>
              <Typography variant="h5" component="h5">
                {lang}
              </Typography>
              <Typography variant="body1" component="p">
                {translations[lang].join(" / ")}
              </Typography>
            </Grid>
          ) : null
        )}
      </Grid>
    </Box>
  );
};

export default Translations;
