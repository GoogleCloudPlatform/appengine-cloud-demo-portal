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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import SyntaxHighlighter from "react-syntax-highlighter";
import { createStyles, makeStyles } from "@material-ui/core";
import { obsidian } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const useStyles = makeStyles(() =>
  createStyles({
    code: {
      fontSize: "1.2rem",
      fontFamily: `source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace`,
      lineHeight: 1,
    },
  })
);

type Props = {
  language: string;
};

const Code: React.FC<Props> = ({ language, children }) => {
  const classes = useStyles();

  return (
    <SyntaxHighlighter
      language={language}
      style={obsidian}
      className={classes.code}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default Code;
