import React from "react";
import style from "./style.module.scss";
import Header from "../../components/header/Header";
import rulesImage from "../../assets/images/rules.png";
import { Link } from "react-router-dom";

const Rules = ({ giftLink }) => {
  return (
    <div className={style.rules}>
      <div className={`wrapper ${style.rules__wrapper}`}>
        <Header giftLink={giftLink} />

        <div className={style.rules__image}>
          <img src={rulesImage} alt="rules" />
        </div>

        <ul>
          <li>
            <p>
              Цель игры – брать в свою команду нужных футболистов и не брать
              тех, кто не подходит тренерскому штабу.
            </p>
          </li>

          <li>
            <p>
              В каждом раунде вам покажут 10 футболистов, но только 5 из них
              подходят под заданный критерий.
            </p>
          </li>

          <li>
            <p>
              За трансфер нужного футболиста вы получите +2 очка, за отказ от
              ненужного +1 очко. Наберите нужное количество очков для
              прохождения в следующий раунд.
            </p>
          </li>
        </ul>

        <Link className={style.rules__link} to="/task">
          Начать игру
        </Link>
      </div>
    </div>
  );
};

export default Rules;
