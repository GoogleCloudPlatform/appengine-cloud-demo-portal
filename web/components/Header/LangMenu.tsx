import { Button, Menu, MenuItem } from "@material-ui/core";
import { useState } from "react";
import { useRouter } from "next/router";

import { useTranslation } from "../../hooks/useTranslation";

const LangMenu: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

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
      <Button
        color="inherit"
        aria-controls="lang-menu"
        aria-haspopup="true"
        onClick={onClick}
      >
        {t.langMenu}
      </Button>
      <Menu
        id="lang-menu"
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={onClose}
      >
        <MenuItem onClick={onLangChanged("en")}>English</MenuItem>
        <MenuItem onClick={onLangChanged("ja")}>日本語</MenuItem>
      </Menu>
    </>
  );
};

export default LangMenu;
