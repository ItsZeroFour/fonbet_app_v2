import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import Header from "../../components/header/Header";
import logo from "../../assets/images/logo_2.svg";
import copy from "../../assets/icons/copy.svg";
import arrowReturn from "../../assets/icons/arrow-return.svg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Conversion = ({ giftLink, registerLink }) => {
  const [searchParams] = useSearchParams();
  const [currectChooseImages, setCurrectChooseImages] = useState([]);
  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const encodedArray = searchParams.get("array")
      ? searchParams
          .get("array")
          .replace(/^\[|\]$/g, "")
          .split(",")
      : [];
    setCurrectChooseImages(encodedArray);
    setScore(+searchParams.get("score"));
  }, [searchParams]);

  console.log(currectChooseImages, score);

  const goBack = () => {
    navigate(`/game?index=${searchParams.get("index")}`, {
      state: { score: score, array: currectChooseImages },
    });
  };

  const copyTextToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Промокод скопирован!");
    } catch (err) {
      alert("Не удалось скопировать промокод");
    }
  };

  return (
    <div className={style.final}>
      <div className={`wrapper ${style.final__wrapper}`}>
        <Header giftLink={giftLink} />

        <div className={style.final__container}>
          <div className={style.final__main}>
            <h2>Ваш подарок</h2>

            <div className={style.final__image}>
              <img src={logo} alt="logo" />
              <div className={style.final__sum}>
                <h1>100 000 ₽</h1>
              </div>
            </div>

            <p>
              Введите промокод SCOUT24 в личном кабинете, если вы уже клиент
              FONBET.
            </p>

            <div className={style.final__promo}>
              <p>Scout24</p>
              <button onClick={() => copyTextToClipboard("Scout24")}>
                <img src={copy} alt="copy" />
              </button>
            </div>
          </div>

          <div className={style.final__buttons}>
            <Link to={registerLink}>В личный кабинет</Link>
            <button onClick={goBack}>
              Вернуться в игру <img src={arrowReturn} alt="arrow return" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversion;
