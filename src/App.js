import { Route, Routes } from "react-router-dom";
import StartScreen from "./screens/start_screen/StartScreen";
import Rules from "./screens/rules/Rules";
import Task from "./screens/task/Task";
import Game from "./screens/game/Game";
import Conversion from "./screens/conversion/Conversion";
import { useEffect, useState } from "react";
import linkData from "./data/links.json";
import Final from "./screens/final/Final";

function App() {
  const [giftLink, setGiftLink] = useState(
    "https://af-ru2e2e.com/click?offer_id=125&partner_id=11177&landing_id=4012&utm_medium=affiliate&web_master_id={web_master_id}&partner_click_id={partner_click_id}&sub_1={sport24}&sub_2={spec}&sub_3={scout}&sub_4={promo}&sub_5={source_1}"
  );
  const [registerLink, setRegisterLink] = useState(
    "https://af-ru2e2e.com/click?offer_id=125&partner_id=11177&landing_id=4019&utm_medium=affiliate&web_master_id={web_master_id}&partner_click_id={partner_click_id}&sub_1={sport24}&sub_2={spec}&sub_3={scout}&sub_4={promo}&sub_5={source_1}"
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const urlSourceParams = Array.from(urlParams.entries())
      .filter(([key]) => key.startsWith("utm_"))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const linkInfo = linkData.find(
      (item) => item.sourceUrl === urlSourceParams
    );

    if (linkInfo) {
      const newGiftLink = linkInfo.giftLink.replace("{sub_5}", linkInfo.sub5);
      const newRegisterLink = linkInfo.registerLink.replace(
        "{sub_5}",
        linkInfo.sub5
      );
      setGiftLink(newGiftLink);
      setRegisterLink(newRegisterLink);

      localStorage.setItem("giftLink", newGiftLink);
      localStorage.setItem("registerLink", newRegisterLink);
    }
  }, []);

  useEffect(() => {
    const storedGiftLink = localStorage.getItem("giftLink");
    const storedRegisterLink = localStorage.getItem("registerLink");

    if (storedGiftLink) {
      setGiftLink(storedGiftLink);
    }
    if (storedRegisterLink) {
      setRegisterLink(storedRegisterLink);
    }
  }, [localStorage.getItem("giftLink"), localStorage.getItem("registerLink")]);

  return (
    <div className="App">
      <div className="page">
        <Routes>
          <Route
            path="/"
            element={
              <StartScreen giftLink={giftLink} registerLink={registerLink} />
            }
          />
          <Route
            path="/rules"
            element={<Rules giftLink={giftLink} registerLink={registerLink} />}
          />
          <Route
            path="/task"
            element={<Task giftLink={giftLink} registerLink={registerLink} />}
          />
          <Route
            path="/game"
            element={<Game giftLink={giftLink} registerLink={registerLink} />}
          />
          <Route
            path="/conversion"
            element={
              <Conversion giftLink={giftLink} registerLink={registerLink} />
            }
          />
          <Route
            path="/final"
            element={<Final giftLink={giftLink} registerLink={registerLink} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
