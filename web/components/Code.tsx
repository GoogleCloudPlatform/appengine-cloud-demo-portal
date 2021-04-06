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
