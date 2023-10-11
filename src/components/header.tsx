import * as React from "react";
import Cta from "../../../vodafone-new/src/components/cta";
import { useChatModeContext } from "../hooks";
import Toast from "./Toast";

type Link = {
  label: string;
  url: string;
};

const links: Link[] = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "About",
    url: "/turtlehead-tacos",
  },
];

const Header = () => {
  const linkDoms = links.map((link) => (
    <div key={link.label}>
      <a href={link.url} target="_blank" rel="noreferrer">
        {link.label}
      </a>
    </div>
  ));
  const { showToast, setShowToast } = useChatModeContext();

  const handleHideToast = () => {
    setShowToast(false);
  };
  return (
    <div>
      {showToast && (
        <Toast
          message="Grazie per il tuo feedback!"
          onClose={handleHideToast}
        />
      )}

      <img src="https://i.imgur.com/bTlOBZ3.png" alt="" />
    </div>
  );
};

export default Header;
