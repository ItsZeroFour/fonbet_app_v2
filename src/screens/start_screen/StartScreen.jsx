import React from "react";
import style from "./style.module.scss";
import Header from "../../components/header/Header";
import title from "../../assets/images/start_title.svg";
import ball from "../../assets/icons/start/ball.svg";
import group_search from "../../assets/icons/start/group_search.svg";
import route from "../../assets/icons/start/route.svg";
import { Link } from "react-router-dom";

const StartScreen = ({ giftLink }) => {
  return (
    <section className={style.start}>
      <div className="container">
        <div className={`wrapper ${style.start__wrapper}`}>
          <Header giftLink={giftLink} />

          <div className={style.start__title}>
            <img src={title} alt="title" />
          </div>

          <ul>
            <li>
              <img src={ball} alt="ball" />
              <p>Проверьте свою футбольную память и интуицию!</p>
            </li>

            <li>
              <img src={group_search} alt="group search" />
              <p>
                Станьте футбольным скаутом и покупай в свой клуб игроков,
                подходящих под требования тренерского штаба.
              </p>
            </li>

            <li>
              <img src={route} alt="route" />
              <p>
                Сможете пройти путь от стажировки в середняке РПЛ до работы в
                европейском топе?
              </p>
            </li>
          </ul>

          <div className={style.start__bottom}>
            <Link className={style.start__link} to="/rules">
              Старт
            </Link>

            <p>
              Реклама 18+. Рекламодатель ООО «Фонкор». Erid:
              F7NfYUJCUneLt1tqhx9B По всем вопросам:{" "}
              <Link to="mailto:alarm24@sport24.ru">alarm24@sport24.ru</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartScreen;
