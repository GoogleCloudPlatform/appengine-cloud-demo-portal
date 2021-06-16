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
