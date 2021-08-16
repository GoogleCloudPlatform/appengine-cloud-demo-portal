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
            <IconButton
              aria-label="github"
              color="inherit"
              href="https://github.com/GoogleCloudPlatform/appengine-cloud-demo-portal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </IconButton>
          </nav>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
