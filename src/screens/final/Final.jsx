import React from "react";
import Header from "../../components/header/Header";
import { Link } from "react-router-dom";
import style from "./style.module.scss";
import arrowRight from "../../assets/icons/arrow_right_alt.svg";

const Final = ({ giftLink, registerLink }) => {
  return (
    <div className={style.final}>
      <div className={`wrapper ${style.final__wrapper}`}>
        <Header registerLink={registerLink} giftLink={giftLink} />

        <div className={style.final__container}>
          <h1>Играй пройдена!</h1>

          <div className={style.game__banner}>
            <h2>Примите участие в розыгрыше</h2>

            <div className={style.game__banner__cupon}>
              <p>100 000 ₽*</p>
            </div>

            <Link
              className={style.game__banner__link_1}
              onClick={() => {
                if (window.ym) {
                  window.ym(
                    98751165,
                    "reachGoal",
                    `final--10---conversion`
                  );
                }
              }}
              to={registerLink}
              target="_blank"
            >
              Регистрация
            </Link>
          </div>

          <div className={style.final__bottom}>
            <Link
              onClick={() => {
                if (window.ym) {
                  window.ym(98751165, "reachGoal", "offer--10---conversion");
                }
              }}
              to={giftLink}
              target="_blank"
            >
              Забрать подарок
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Final;
