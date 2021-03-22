import {
  Button,
  Tooltip,
  Menu,
  MenuItem,
  NoSsr,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { useState } from "react";
import { useRouter } from "next/router";
import { ExpandMore, Translate } from "@material-ui/icons";

import { useTranslation } from "../../hooks/useTranslation";
import { languageLabels } from "../../locales";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    language: {
      margin: theme.spacing(0, 0.5, 0, 1),
    },
  })
);

const LangMenu: React.FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const { t, locale } = useTranslation();

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchor(event.currentTarget);
  const onClose = () => setAnchor(null);
  const onLangChanged = (lang: string) => async () => {
    onClose();
    await router.push(router.asPath, router.asPath, { locale: lang });
  };

  return (
    <>
      <Tooltip title={t.changeLanguage} enterDelay={300}>
        <Button
          color="inherit"
          aria-owns={anchor ? "language-menu" : undefined}
          aria-haspopup="true"
          aria-label={t.changeLanguage}
          onClick={onClick}
        >
          <Translate />
          <span className={classes.language}>{languageLabels[locale]}</span>
          <ExpandMore fontSize="small" />
        </Button>
      </Tooltip>
      <NoSsr defer>
        <Menu
          id="lang-menu"
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={onClose}
        >
          {Object.keys(languageLabels).map((code: string) => (
            <MenuItem onClick={onLangChanged(code)} key={code}>
              {languageLabels[code]}
            </MenuItem>
          ))}
        </Menu>
      </NoSsr>
    </>
  );
};

export default LangMenu;
