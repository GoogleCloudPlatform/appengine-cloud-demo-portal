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

import { EntityMention, Response } from "../../src/api/contactCenterAnalysis";

type Props = {
  result: Response;
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
  url: string;
  salience: number;
  beginOffset: number;
};

const sortFn = (a: EntityMention, b: EntityMention): number => {
  if (a.text.beginOffset === b.text.beginOffset) {
    return b.text.content.length - a.text.content.length;
  } else {
    return a.text.beginOffset - b.text.beginOffset;
  }
};

const entityColors: { [key: string]: string } = {
  ORGANIZATION: "#4285F5",
  LOCATION: "#34A853",
  CONSUMER_GOOD: "#A242F4",
  PERSON: "#EA4235",
  OTHER: "#9AA0A6",
  EVENT: "#F29900",
  ADDRESS: "#F538A0",
  PRICE: "#B31411",
  NUMBER: "#185ABC",
  UNKNOWN: "#9AA0A6",
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
  result.entities.forEach((entity) => {
    entity.mentions.sort(sortFn).forEach((mention) => {
      mentions.push({
        name: entity.name,
        content: mention.text.content,
        type: entity.type,
        url: entity.metadata["wikipedia_url"],
        salience: entity.salience,
        beginOffset: mention.text.beginOffset,
      });
    });
  });

  const text = result.document.content;
  const sentence: JSX.Element[] = [];
  let i = 0;
  mentions.forEach((mention) => {
    if (mention.beginOffset < i) {
      return;
    }
    const pre = text.substring(i, mention.beginOffset);
    sentence.push(<span>{pre}</span>);

    const tooltip =
      `entity=${mention.name}, ` +
      `type=${mention.type}, ` +
      `salience=${mention.salience}`;
    const content = (
      <span
        style={{
          color: entityColors[mention.type] || entityColors["UNKNOWN"],
        }}
      >
        {mention.content}
      </span>
    );
    sentence.push(
      <Tooltip title={tooltip}>
        <span>
          ⟨
          {mention.url ? (
            <a
              href={mention.url}
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
    i = mention.beginOffset + mention.content.length;
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
                  {result.categories.map((c) => c.name).join(", ")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>{sentence.map((s) => s)}</Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default NaturalLanguageAnnotatedResult;
