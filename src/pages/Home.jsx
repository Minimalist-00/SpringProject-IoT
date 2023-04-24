import React, { useState, useEffect } from "react";
import db from "../firebase";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { Chart as GaugeChart } from "react-google-charts";
import "../style/homeStyle.css";
import { Omikuji } from "../utils/Omikuji";
import clap from "../img/clap.png";
// import { Link } from "react-router-dom";
// import { css } from "@emotion/css";

function Home() {
  const [temperatureAve, setTemparetureAve] = useState(0); //引数に初期値0を指定
  const [humidityAve, setHumidityAve] = useState(0);
  const [pressureAve, setPressureAve] = useState(0);
  const [door, setDoor] = useState(0);
  const [conferenceRoom, setConferenceRoom] = useState(0);

  useEffect(() => {
    /* データベースからデータを取得する */
    const weatherData = collection(db, "temperatureTeam");
    const doorData = doc(db, "users", "alovelace");
    const conferenceData = doc(db, "conference", "m5stack");

    /* リアルタイムで取得 */
    onSnapshot(weatherData, (querySnapshot) => {
      /* 温度の平均値算出 */
      const temperatureData = querySnapshot.docs.map(
        (doc) => doc.data().temperature
      ); //各ドキュメントから温度を取得（3つの温度 配列）
      const tempSum = temperatureData.reduce((acc, curr) => acc + curr, 0);
      const tempAve = Math.round((tempSum / temperatureData.length) * 10) / 10;
      setTemparetureAve(tempAve); //平均値をセット

      /* 湿度の平均値算出 */
      const humidityData = querySnapshot.docs.map((doc) => doc.data().humidity);
      const humSum = humidityData.reduce((acc, curr) => acc + curr, 0);
      const humAve = Math.round((humSum / humidityData.length) * 10) / 10;
      setHumidityAve(humAve);

      /* 気圧の平均値算出 */
      const pressureData = querySnapshot.docs.map((doc) => doc.data().pressure);
      const preSum = pressureData.reduce((acc, curr) => acc + curr, 0);
      const preAve = Math.round((preSum / pressureData.length) * 10) / 10;
      setPressureAve(preAve);
    });

    /* 扉の開閉状況を取得 */
    onSnapshot(doorData, (querySnapshot) => {
      setDoor(querySnapshot.data()); // users > alovelaceのフィールドを取得
    });
    /* 会議室の状況を取得 */
    onSnapshot(conferenceData, (querySnapshot) => {
      setConferenceRoom(querySnapshot.data()); // conference > m5stackのフィールドを取得
    });
  }, []);

  /* ---- 会議室の状況を表示 ----------------------------------- */
  let availability = "";
  let conferenceRoomImage;
  if (conferenceRoom.light == true && conferenceRoom.exist == true) {
    availability = "会議室は現在使用中です";
    conferenceRoomImage = "use";
  } else {
    availability = "会議室は現在空いています";
    conferenceRoomImage = "vacancy";
  }

  /* ---- 気象テキスト ----------------------------------- */
  const now = new Date();
  const month = now.getMonth() + 1; // 月は0から始まるため1を加算する
  let temperatureMessage;
  let humidityMessage;
  let pressureDiff = Math.round((1013 - pressureAve) * 10) / 10;

  /*
  ○室内の適温
    春：18℃～22℃｜夏：25℃～28℃｜秋：18℃～22℃｜冬：15℃～20℃
  ○適正湿度
    冬季（暖房使用時）：40%〜50%｜春秋季：40%〜60%｜夏季（クーラー使用時）：50%〜60%
  */

  /* --- 春・秋の場合 ----------- */
  if ((month >= 3 && month <= 5) || (month >= 9 && month <= 11)) {
    if (temperatureAve >= 18 && temperatureAve <= 22) {
      temperatureMessage = "いい感じの温度です！";
    } else if (temperatureAve < 18) {
      temperatureMessage = "今は少し寒いみたいですね";
    } else {
      temperatureMessage = "今は少し暑いみたいですね";
    }

    if (humidityAve >= 40 && humidityAve <= 60) {
      humidityMessage = "いい感じの湿度です！";
    } else if (humidityAve < 40) {
      humidityMessage = "なんか･･･空気乾燥してません？";
    } else {
      humidityMessage = "なんか･･･空気湿っぽいですね。";
    }

    /* --- 夏の場合 ----------- */
  } else if (month >= 6 && month <= 8) {
    if (temperatureAve >= 25 && temperatureAve <= 28) {
      temperatureMessage = "いい感じの温度です！";
    } else if (temperatureAve < 25) {
      temperatureMessage = "今は少し寒いみたいですね";
    } else {
      temperatureMessage = "今は少し暑いみたいですね";
    }

    if (humidityAve >= 40 && humidityAve <= 50) {
      humidityMessage = "いい感じの湿度です！";
    } else if (humidityAve < 40) {
      humidityMessage = "なんか･･･空気乾燥してません？";
    } else {
      humidityMessage = "なんか･･･空気湿っぽいですね...。";
    }

    /* --- 冬の場合 ----------- */
  } else {
    if (temperatureAve >= 15 && temperatureAve <= 20) {
      temperatureMessage = "いい感じの温度です！";
    } else if (temperatureAve < 15) {
      temperatureMessage = "今は少し寒いみたいですね";
    } else {
      temperatureMessage = "今は少し暑いみたいですね";
    }

    if (humidityAve >= 50 && humidityAve <= 60) {
      humidityMessage = "いい感じの湿度です！";
    } else if (humidityAve < 50) {
      humidityMessage = "なんか･･･空気乾燥してません？";
    } else {
      humidityMessage = "なんか･･･空気湿っぽいですね...。";
    }
  }

  /* ---- 現時刻関係 ----------------------------------- */
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
    day: "",
  });

  useEffect(() => {
    const updateDateTime = setInterval(() => {
      const currentDate = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = currentDate.toLocaleDateString("ja-JP", options);
      const time = currentDate.toLocaleTimeString("ja-JP");
      const day = currentDate.toLocaleDateString("ja-JP", { weekday: "long" });
      setDateTime({ date, time, day });
    }, 1000);
    return () => clearInterval(updateDateTime);
  }, []);
  /* ------------------------------------------------------ */

  /* ---- グラフの描画設定 ----------------------------------- */
  const temp_gcData = [
    ["Label", "Value"],
    ["Temp", temperatureAve],
  ];

  const temp_gcOption = {
    greenColor: "#3f9cff", //青色に変更
    greenFrom: 0,
    greenTo: 15,
    redFrom: 35, //赤枠の始まり
    redTo: 40, //赤枠の終わり
    yellowFrom: 30,
    yellowTo: 35,
    minorTicks: 10, //大きい目盛りから次の大きい目盛りまでの間隔
    min: 0,
    max: 40,
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  const hum_gcData = [
    ["Label", "Value"],
    ["Humidity", humidityAve],
  ];

  const hum_gcOption = {
    greenColor: "#3f9cff",
    greenFrom: 60,
    greenTo: 80,
    redFrom: 0,
    redTo: 20,
    yellowFrom: 20,
    yellowTo: 40,
    minorTicks: 6,
    min: 0,
    max: 80,
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  return (
    <div id="home">
      <Omikuji>
        <body>
          <header>
            <h1>春プロ&nbsp;&nbsp;&nbsp;</h1>
            <h1>IoTチーム</h1>
          </header>
          <div className="DXC-title">現在のDXセンター内の状況</div>

          <main>
            <div className="column-contents">
              <div className="box">
                <h2>気温{temperatureAve}℃</h2>
                <p>{temperatureMessage}</p>
                <div className="parent-container">
                  <GaugeChart
                    chartType="Gauge"
                    data={temp_gcData}
                    options={temp_gcOption}
                    className="gauge-graph"
                  />
                </div>
              </div>

              <div className="box">
                <h2>扉が開いた回数 / 日</h2>
                <p>{door.OpenCount}回</p>
                <p className="comment">※開閉回数は毎日0:00にリセットされます</p>
              </div>
            </div>
            <div className="column-contents">
              <div className="box">
                <h2>湿度{humidityAve}%</h2>
                <p>{humidityMessage}</p>
                <div className="parent-container">
                  <GaugeChart
                    chartType="Gauge"
                    data={hum_gcData}
                    options={hum_gcOption}
                    className="gauge-graph"
                  />
                </div>
              </div>
              <div className="box">
                <h2>現時刻</h2>
                <p>
                  {dateTime.date}&nbsp;&nbsp;{dateTime.time}
                </p>
              </div>
              <div className="box">
                <h2>今日の運勢を占ってみませんか？</h2>
                <img src={clap} width={"100px"} height={"100px"} />
                <p className="comment">画面の前で手を合わせてみてください</p>
                {/* <Link to="/Omikuji">
                  <button className="btn btn-6 btn-6c">YES</button>
                </Link>
                <Link to="/Omikuji">
                  <button className="btn btn-6 btn-6c">はい</button>
                </Link> */}
              </div>
            </div>
            <div className="column-contents">
              <div className="box">
                <h2>気圧{pressureAve}hpa</h2>
                <p>一般的な気圧とは</p>
                <p>{pressureDiff}hpaの差があります</p>
              </div>
              <div className="box">
                <h2>会議室の利用状況</h2>
                <p>{availability}</p>
                <img
                  className="conferenceRoom"
                  src={"images/" + conferenceRoomImage + "_conference_room.jpg"}
                />
              </div>
            </div>
          </main>
        </body>
      </Omikuji>
    </div>
  );
}

export default Home;
