import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import footballers from "../../data/footballers.json";
import Header from "../../components/header/Header";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import arrowRight from "../../assets/icons/arrow_right_alt.svg";
import audioCorrect from "../../assets/audios/true.mp3";
import audioUncorrect from "../../assets/audios/wrong.mp3";
import useSound from "use-sound";

const Game = React.memo(({ giftLink, registerLink }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [playAudioCorrect] = useSound(audioCorrect);
  const [playAudioUncorrect] = useSound(audioUncorrect);
  const [playAudioWin] = useSound(audioCorrect);
  const [playAudioLoose] = useSound(audioUncorrect);

  const [searchParams] = useSearchParams();
  const [index, setIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [isCorrectChoose, setIsCorrectChoose] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCorrectChoosed, setIsCorrectChoosed] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [shuffledFootballers, setShuffledFootballers] = useState([]);
  const [dragX, setDragX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [correctChoosedImages, setCorrectChoosedImages] = useState([]);
  const [rightSwipeCount, setRightSwipeCount] = useState(0);
  const [onRightSwipe, setOnRightSwipe] = useState(false);
  const [trueSwiperCount, setTrueSwiperCount] = useState(0);
  const [isImageLoaded, setImageLoaded] = useState(false);

  const targetDragX = useRef(0);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (location.state?.score) {
      setScore(location.state.score);
      setIsEnd(true);
    }

    if (location.state?.array) {
      setCorrectChoosedImages(location.state.array);
      setIsEnd(true);
    }
  }, [location]);

  useEffect(() => {
    const indexParam = searchParams.get("index");
    const parsedIndex = parseInt(indexParam, 10);

    if (
      !isNaN(parsedIndex) &&
      parsedIndex >= 0 &&
      parsedIndex < footballers.items.length
    ) {
      setIndex(parsedIndex);
    } else {
      navigate("/final");
    }
  }, [searchParams]);

  const handleNavigateToConversionPage = () => {
    navigate(
      `/conversion?array=[${correctChoosedImages}]&score=${score}&index=${index}`
    );
  };

  const currentChapter =
    index < 4
      ? 1
      : index >= 4 && index < 8
      ? 2
      : index >= 8 && index < 12
      ? 3
      : 4;

  useEffect(() => {
    if (index === 0 && window.ym) {
      window.ym(98751165, "reachGoal", "start----interaction");
    }
  }, []);

  const item = footballers?.items[index];
  const totalCorrectItems = item?.footballers.filter(
    ({ isCorrect }) => isCorrect === true
  ).length;

  function checkIsEnd() {
    if (isCorrectChoose >= item?.footballers.length) {
      setIsEnd(true);
    } else if (currentIndex + 1 > item?.footballers.length) {
      setIsEnd(true);
    }
  }

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("offVoice")) === false) {
      if (isEnd && currentChapter === 1 && score >= 6) {
        playAudioWin();
      } else if (isEnd && currentChapter === 2 && score >= 8) {
        playAudioWin();
      } else if (isEnd && currentChapter === 3 && score >= 10) {
        playAudioWin();
      } else if (isEnd && currentChapter === 3 && score >= 12) {
        playAudioWin();
      }

      if (isEnd && currentChapter === 1 && score < 6) {
        playAudioLoose();
      } else if (isEnd && currentChapter === 2 && score < 8) {
        playAudioLoose();
      } else if (isEnd && currentChapter === 3 && score < 10) {
        playAudioLoose();
      } else if (isEnd && currentChapter === 3 && score < 12) {
        playAudioLoose();
      }
    }
  }, [isEnd]);

  useEffect(() => {
    checkIsEnd();
  }, [currentIndex]);

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    if (item?.footballers) {
      setShuffledFootballers(shuffle([...item.footballers]));
    }
  }, [item?.footballers]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const preloadNextImage = (index) => {
    if (shuffledFootballers[index + 1]?.image) {
      const img = new Image();
      img.src = require(`../../assets/images/footballers/${
        shuffledFootballers[index + 1].image
      }`).default;
    }
  };

  useEffect(() => {
    preloadNextImage(currentIndex);
  }, [currentIndex]);

  const swiped = (dir, isCorrect) => {
    if (!shuffledFootballers[currentIndex]) return;

    if (dir === "left" && !isCorrect) {
      setIsCorrectChoose(true);
      setRightSwipeCount((prevCount) => prevCount + 1);
      if (JSON.parse(localStorage.getItem("offVoice")) === false) {
        playAudioCorrect();
      }
    } else if (dir === "right" && isCorrect) {
      setIsCorrectChoose(true);
      setScore((prevScore) => prevScore + 1);
      setIsCorrectChoosed((prev) => prev + 1);
      setRightSwipeCount((prevCount) => prevCount + 1);
      setCorrectChoosedImages((prevImages) => [
        ...prevImages,
        shuffledFootballers[currentIndex].image,
      ]);
      if (JSON.parse(localStorage.getItem("offVoice")) === false) {
        playAudioCorrect();
      }
    } else {
      setScore((prevScore) => prevScore - 1);
      setIsCorrectChoose(false);
      playAudioUncorrect();
    }

    if (dir === "right") {
      setTrueSwiperCount((prevCount) => prevCount + 1);
    }

    checkIsEnd();
    setShowMessage(true);

    if (!(index === 0 && rightSwipeCount <= 2)) {
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    } else {
      setOnRightSwipe(true);
    }

    const x = dir === "left" ? -1000 : 1000;
    const card = document.querySelector(`.${style.card}`);

    if (card) {
      card.animate(
        [{ transform: "translateX(0)" }, { transform: `translateX(${x}px)` }],
        {
          duration: 0,
          easing: "ease-in-out",
          fill: "forwards",
        }
      ).onfinish = () => {
        setSwiping(false);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      };
    }
  };

  const handleSwipe = (direction, isCorrect) => {
    setTimeout(() => {
      setSwiping(true);
    }, 1500);

    swiped(direction, isCorrect);
    setDragX(0);
  };

  const handlers = useSwipeable({
    delta: 10,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const buttonVariants = {
    initial: { backgroundColor: "transparent", color: "#fff" },
    animate: { backgroundColor: "#e80024", color: "#fff" },
    whileTap: { backgroundColor: "#fff", color: "#e80024" },
  };

  const buttonVariants2 = {
    initial: { backgroundColor: "transparent", color: "#fff" },
    animate: { backgroundColor: "#fff", fill: "#e80024" },
    whileTap: { backgroundColor: "#e80024", color: "#e80024" },
  };

  return (
    <div className={style.game}>
      <div className={`wrapper ${style.game__wrapper}`}>
        <Header giftLink={giftLink} />

        {!isEnd ? (
          <div className={style.game__container}>
            {item && (
              <React.Fragment>
                {!(index === 0 && onRightSwipe && rightSwipeCount <= 2) && (
                  <React.Fragment>
                    <div className={style.game__task}>
                      <div className={style.game__task__index}>
                        {item.index}
                      </div>
                      <p>{item.task}</p>
                    </div>

                    <div className={style.game__task__score}>
                      <ul>
                        {item.footballers.map((_, idx) => (
                          <li
                            key={idx}
                            style={
                              currentIndex === idx
                                ? { background: "#E80024" }
                                : { background: "rgba(255, 255, 255, 0.1)" }
                            }
                          ></li>
                        ))}
                      </ul>

                      <p>Очки: {score}</p>
                    </div>
                  </React.Fragment>
                )}

                <div className={style.game__cards__container}>
                  {showMessage &&
                  index === 0 &&
                  rightSwipeCount <= 2 &&
                  isCorrectChoose ? (
                    <div className={style.game__cards__correct}>
                      <h3>Верно!</h3>

                      <div className={style.game__banner}>
                        <h2>Вам подарок от FONBET!</h2>

                        <div className={style.game__banner__cupon}>
                          <p>до 15 000 ₽*</p>
                        </div>

                        <p>
                          Пройдите игру до конца, чтобы принять участие в
                          розыгрыше 100 000 ₽ фрибетами.
                        </p>

                        <Link
                          className={style.game__banner__link_1}
                          onClick={() => {
                            if (window.ym) {
                              window.ym(
                                98751165,
                                "reachGoal",
                                `offer--${rightSwipeCount}---conversion`
                              );
                            }
                          }}
                          to={giftLink}
                          target="_blank"
                        >
                          Забрать подарок
                        </Link>
                      </div>

                      <div className={style.game__cards__correct__bottom}>
                        <button
                          onClick={() => {
                            if (window.ym) {
                              window.ym(
                                98751165,
                                "reachGoal",
                                `offer--${rightSwipeCount}--play--interaction`
                              );
                            }

                            setSwiping(false);
                            setShowMessage(false);
                            setOnRightSwipe(false);
                          }}
                        >
                          Играть дальше
                        </button>

                        <p>
                          *Предоставляется в виде бонусов (Фрибетов), подробнее
                          в правилах игры.
                        </p>
                      </div>
                    </div>
                  ) : (
                    showMessage &&
                    index === 0 &&
                    rightSwipeCount <= 2 && (
                      <div
                        className={`${style.message} ${style.message__index}`}
                      >
                        <p>Не верно</p>

                        <p style={{ opacity: 0 }}>
                          {setTimeout(() => {
                            setSwiping(false);
                            setShowMessage(false);
                            setOnRightSwipe(false);
                          }, 1500)}
                        </p>
                      </div>
                    )
                  )}

                  {showMessage && rightSwipeCount > 2 && index === 0 ? (
                    <div className={style.message}>
                      {isCorrectChoose ? (
                        <>
                          <p style={{ opacity: 0 }}>
                            {setTimeout(() => {
                              setSwiping(false);
                              setShowMessage(false);
                              setOnRightSwipe(false);
                            }, 1500)}
                          </p>
                          <p>Верно!</p>
                        </>
                      ) : (
                        <>
                          <p style={{ opacity: 0 }}>
                            {setTimeout(() => {
                              setSwiping(false);
                              setShowMessage(false);
                              setOnRightSwipe(false);
                            }, 1500)}
                          </p>
                          <p>Не верно</p>
                        </>
                      )}
                    </div>
                  ) : (
                    showMessage &&
                    index !== 0 && (
                      <div className={style.message}>
                        {isCorrectChoose ? (
                          <>
                            <p>Верно!</p>
                            <p style={{ opacity: 0 }}>
                              {setTimeout(() => {
                                setSwiping(false);
                              }, 1500)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p>Не верно</p>
                            <p style={{ opacity: 0 }}>
                              {setTimeout(() => {
                                setSwiping(false);
                              }, 1500)}
                            </p>
                          </>
                        )}
                      </div>
                    )
                  )}

                  {!showMessage &&
                    currentIndex < shuffledFootballers.length &&
                    shuffledFootballers.length > 0 && (
                      <motion.div
                        {...handlers}
                        className={style.swipe}
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: 0, rotate: 0 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0}
                        onDrag={(e, info) => {
                          setDragX(info.offset.x);
                        }}
                        onDragEnd={(e, info) => {
                          const direction =
                            info.offset.x > 0 ? "right" : "left";
                          const isCorrect =
                            shuffledFootballers[currentIndex]?.isCorrect;

                          if (Math.abs(info.offset.x) > 150) {
                            handleSwipe(direction, isCorrect);
                          } else {
                            targetDragX.current = 0;
                          }
                        }}
                        style={{ position: "absolute" }}
                      >
                        <div
                          className={`${style.card} ${
                            swiping ? style.swipeActive : ""
                          }`}
                          style={{
                            transform: `translateX(${dragX}px) rotate(${
                              dragX / 15
                            }deg)`,
                            transition: !swiping
                              ? "transform 0.3s ease-out"
                              : "none",
                          }}
                        >
                          <img
                            src={require(`../../assets/images/footballers/${shuffledFootballers[currentIndex].image}`)}
                            alt="card"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(false)}
                          />
                          {isImageLoaded && (
                            <h3>{shuffledFootballers[currentIndex]?.name}</h3>
                          )}
                        </div>
                      </motion.div>
                    )}
                </div>

                {!showMessage && (
                  <div className={style.game__cards__nav}>
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="whileTap"
                      disabled={swiping}
                      onClick={() => {
                        setDragX(0);
                        handleSwipe(
                          "left",
                          shuffledFootballers[currentIndex]?.isCorrect
                        );
                      }}
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.87124 0.589305C3.10304 -0.178898 1.85754 -0.178898 1.08934 0.589305C0.321133 1.35751 0.321133 2.60301 1.08934 3.37121L7.71812 10L1.08933 16.6288C0.321133 17.397 0.321133 18.6425 1.08934 19.4107C1.85754 20.1789 3.10304 20.1789 3.87124 19.4107L10.5 12.7819L17.1288 19.4107C17.897 20.1789 19.1425 20.1789 19.9107 19.4107C20.6789 18.6425 20.6789 17.397 19.9107 16.6288L13.2819 10L19.9107 3.37121C20.6789 2.60301 20.6789 1.35751 19.9107 0.589305C19.1425 -0.178898 17.897 -0.178898 17.1288 0.589305L10.5 7.21809L3.87124 0.589305Z"
                          fill="white"
                        />
                      </svg>
                    </motion.button>

                    <motion.button
                      variants={buttonVariants2}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="whileTap"
                      disabled={swiping}
                      onClick={() => {
                        setDragX(0);
                        handleSwipe(
                          "right",
                          shuffledFootballers[currentIndex]?.isCorrect
                        );
                      }}
                    >
                      <svg
                        width="23"
                        height="16"
                        viewBox="0 0 23 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M22.4238 1.08602C23.1921 1.85423 23.1921 3.09973 22.4238 3.86793L11.3778 14.914C10.6096 15.6822 9.36409 15.6822 8.59589 14.914L0.576152 6.89425C-0.192051 6.12604 -0.192051 4.88054 0.576152 4.11234C1.34435 3.34414 2.58986 3.34414 3.35806 4.11234L9.98684 10.7411L19.6419 1.08602C20.4101 0.317822 21.6556 0.317822 22.4238 1.08602Z"
                          fill="#e80024"
                        />
                      </svg>
                    </motion.button>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        ) : (
          <div className={style.game__final}>
            <div className={style.game__total}>
              <h1>
                {currentChapter === 1
                  ? score >= 2
                    ? "Раунд пройден!"
                    : "Вы проиграли :("
                  : currentChapter === 2
                  ? score >= 3
                    ? "Раунд пройден!"
                    : "Вы проиграли :("
                  : currentChapter === 3
                  ? score >= 4
                    ? "Раунд пройден!"
                    : "Вы проиграли :("
                  : score >= 5
                  ? "Раунд пройден!"
                  : "Вы проиграли :("}
              </h1>

              <div>
                <p>
                  {correctChoosedImages.length}/
                  {
                    shuffledFootballers.filter(
                      ({ isCorrect }) => isCorrect === true
                    ).length
                  }
                </p>
                <p>Очки: {score}</p>
              </div>
            </div>

            <p>
              {score >=
              (currentChapter === 1
                ? 2
                : currentChapter === 2
                ? 3
                : currentChapter === 3
                ? 4
                : 5) ? (
                <>
                  Поздравляем, скаут! <br /> Вот кого из нужных игроков вы взяли
                  в команду:
                </>
              ) : (
                <>Вот кого из нужных игроков вы взяли в команду:</>
              )}
            </p>

            <div className={style.game__final__chosed}>
              <ul>
                {item.footballers
                  .filter(({ isCorrect }) => isCorrect === true)
                  .map(({ image }, idx) => (
                    <li key={idx}>
                      <motion.img
                        src={require(`../../assets/images/footballers/${image}`)}
                        alt={idx + 1}
                        initial={{ opacity: 0.25 }}
                        animate={
                          correctChoosedImages.includes(image) && { opacity: 1 }
                        }
                        transition={
                          correctChoosedImages.includes(image) && {
                            delay: 2,
                            duration: 0.5,
                          }
                        }
                      />
                    </li>
                  ))}
              </ul>
            </div>

            {score >=
            (currentChapter === 1
              ? 2
              : currentChapter === 2
              ? 3
              : currentChapter === 3
              ? 4
              : 5) ? (
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
                        `final--${index + 1}---conversion`
                      );
                    }
                  }}
                  to={registerLink}
                  target="_blank"
                >
                  Регистрация
                </Link>

                <div className={style.game__banner__link__container}>
                  <button
                    className={style.game__banner__link_2}
                    onClick={handleNavigateToConversionPage}
                  >
                    Я уже с FONBET <img src={arrowRight} alt="arrow right" />
                  </button>
                </div>
              </div>
            ) : (
              <div className={style.game__banner}>
                <h2>Вам подарок от FONBET!</h2>

                <div className={style.game__banner__cupon}>
                  <p>до 15 000 ₽*</p>
                </div>

                <p>
                  Пройдите игру до конца, чтобы принять участие в розыгрыше 100
                  000 ₽ фрибетами.
                </p>

                <Link
                  className={style.game__banner__link_1}
                  onClick={() => {
                    if (window.ym) {
                      window.ym(
                        98751165,
                        "reachGoal",
                        "offer--10---conversion"
                      );
                    }
                  }}
                  to={giftLink}
                  target="_blank"
                >
                  Забрать подарок
                </Link>
              </div>
            )}

            {score >=
            (currentChapter === 1
              ? 2
              : currentChapter === 2
              ? 3
              : currentChapter === 3
              ? 4
              : 5) ? (
              <button
                onClick={async () => {
                  if (window.ym) {
                    await window.ym(
                      98751165,
                      "reachGoal",
                      `final--${index + 1}--play--interaction`
                    );
                  }

                  if (index === 4 || index === 8 || index === 12) {
                    navigate("/task", { state: { index, currentChapter } });
                  } else {
                    window.location.href = `/game?index=${index + 1}`;
                  }
                }}
              >
                Играть дальше
              </button>
            ) : (
              <Link
                to={`/game?index=${index}`}
                onClick={async () => {
                  if (window.ym) {
                    await window.ym(
                      98751165,
                      "reachGoal",
                      "died-play----interaction"
                    );
                  }

                  window.location.href = `/game?index=${index}`;
                }}
              >
                Играть снова
              </Link>
            )}

            <p>
              *Предоставляется в виде бонусов (Фрибетов), подробнее в правилах
              игры
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Game;
