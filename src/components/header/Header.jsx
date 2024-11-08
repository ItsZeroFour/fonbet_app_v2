import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import gift from "../../assets/icons/gift.svg";
import voice from "../../assets/icons/voice.svg";
import voiceOff from "../../assets/icons/voice-off.svg";

const Header = ({ giftLink }) => {
  const [offVoice, setOffVoice] = useState(() => {
    return localStorage.getItem("offVoice") === "true";
  });

  useEffect(() => {
    localStorage.setItem("offVoice", offVoice);
  }, [offVoice]);

  return (
    <header className={style.head}>
      <Link to={giftLink}>
        <img src={logo} alt="logo" />
      </Link>

      <div className={style.head__buttons}>
        <Link
          onClick={() => {
            if (window.ym) {
              window.ym(98751165, "reachGoal", "podarok----conversion");
            }
          }}
          to={giftLink}
          target="_blank"
        >
          <img src={gift} alt="gift" />
        </Link>

        <button onClick={() => setOffVoice(!offVoice)}>
          <img src={offVoice ? voiceOff : voice} alt="voice" />
        </button>
      </div>
    </header>
  );
};

export default Header;
