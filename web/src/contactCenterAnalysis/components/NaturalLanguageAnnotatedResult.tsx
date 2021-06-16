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
  Grid,
  makeStyles,
  Paper,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { ThumbDown, ThumbsUpDown, ThumbUp } from "@material-ui/icons";

import { AnalyzeResponse } from "../api";

type Props = {
  result: AnalyzeResponse;
  className?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: "100%",
      padding: theme.spacing(2),
      fontSize: "1.5rem",
    },
    entityLink: {
      textDecoration: "none",
      borderBottom: "2px solid " + theme.palette.grey[400],
    },
    good: {
      color: "#4285F5",
    },
    bad: {
      color: "#EA4235",
    },
  })
);

type Mention = {
  name: string;
  content: string;
  type: string;
  url: string | undefined;
  salience: number;
  beginOffset: number;
};

type Sentence = {
  text: string;
  mention?: Mention;
};

const bytes = (s: string): number => new Blob([s]).size;

const sortFn = (a: Mention, b: Mention): number => {
  if (a.beginOffset === b.beginOffset) {
    return b.content.length - a.content.length;
  } else {
    return a.beginOffset - b.beginOffset;
  }
};

const entityColors: { [key: string]: string } = {
  UNKNOWN: "#9AA0A6",
  PERSON: "#EA4235",
  LOCATION: "#34A853",
  ORGANIZATION: "#4285F5",
  EVENT: "#F29900",
  WORK_OF_ART: "#FA7B17",
  CONSUMER_GOOD: "#A242F4",
  OTHER: "#9AA0A6",
  PHONE_NUMBER: "#23C1E0",
  ADDRESS: "#F538A0",
  // DATE: "", I didn't find color of date
  NUMBER: "#185ABC",
  PRICE: "#B31411",
};

const NaturalLanguageAnnotatedResult: React.FC<Props> = ({
  result,
  className,
}) => {
  const classes = useStyles();

  const sentiment = result.documentSentiment;

  let sentimentalIcon;
  if (sentiment.score > 0) {
    sentimentalIcon = <ThumbUp className={classes.good} fontSize="large" />;
  } else if (sentiment.score < 0) {
    sentimentalIcon = <ThumbDown className={classes.bad} fontSize="large" />;
  } else {
    sentimentalIcon = <ThumbsUpDown fontSize="large" />;
  }

  const mentions: Mention[] = [];
  if (result.entities) {
    result.entities.forEach((entity) => {
      entity.mentions.forEach((mention) => {
        mentions.push({
          name: entity.name,
          content: mention.text.content,
          type: entity.type,
          url: entity.metadata && entity.metadata["wikipedia_url"],
          salience: entity.salience,
          beginOffset: mention.text.beginOffset,
        });
      });
    });
    mentions.sort(sortFn);
  }

  const text = result.document.content;

  // TODO: Optimize
  const sentence: Sentence[] = [];
  let byte = 0;
  let i = 0;
  let buf = "";
  let nextMention = 0;
  while (byte < bytes(text)) {
    if (nextMention >= mentions.length) {
      buf += text[i];
      i++;
      byte += bytes(text[i]);
      continue;
    }
    const mention = mentions[nextMention];
    if (byte >= mention.beginOffset) {
      sentence.push({ text: buf });
      sentence.push({ text: mention.content, mention });
      byte += bytes(text.substring(i, i + mention.content.length));
      i += mention.content.length;
      buf = "";
      while (nextMention < mentions.length) {
        if (mentions[nextMention].beginOffset >= byte) {
          break;
        }
        nextMention++;
      }
    } else {
      buf += text[i];
      byte += bytes(text[i]);
      i++;
    }
  }
  sentence.push({ text: buf });

  const sentenceElements: JSX.Element[] = [];
  sentence.forEach((s, i) => {
    if (s.text === "") {
      return;
    }

    if (s.mention) {
      const tooltip =
        `entity=${s.mention.name}, ` +
        `type=${s.mention.type}, ` +
        `salience=${s.mention.salience}`;

      const content = (
        <span
          key={i}
          style={{
            color: entityColors[s.mention.type] || entityColors["UNKNOWN"],
          }}
        >
          {s.mention.content}
        </span>
      );
      sentenceElements.push(
        <Tooltip title={tooltip} key={i}>
          <span>
            ⟨
            {s.mention.url ? (
              <a
                href={s.mention.url}
                target="_blank"
                rel="noreferrer"
                className={classes.entityLink}
              >
                {content}
              </a>
            ) : (
              content
            )}
            ⟩
          </span>
        </Tooltip>
      );
    } else {
      sentenceElements.push(<span key={i}>{s.text}</span>);
    }
  });

  return (
    <div className={className}>
      <Paper className={classes.container}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Tooltip
                  title={`score=${sentiment.score}, magnitude=${sentiment.magnitude}`}
                >
                  {sentimentalIcon}
                </Tooltip>
              </Grid>
              <Grid item>
                <Typography variant="body1" component="p">
                  {result.categories
                    ? result.categories.map((c) => c.name).join(", ")
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {<Grid item>{sentenceElements.map((s) => s)}</Grid>}
        </Grid>
      </Paper>
    </div>
  );
};

export default NaturalLanguageAnnotatedResult;
