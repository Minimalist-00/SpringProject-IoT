// https://google.github.io/mediapipe/solutions/hands
// https://google.github.io/mediapipe/getting_started/javascript.html
// https://github.com/google/mediapipe
// https://stackoverflow.com/questions/67674453/how-to-run-mediapipe-facemesh-on-a-es6-node-js-environment-alike-react
// https://www.npmjs.com/package/react-webcam
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { css, keyframes } from "@emotion/css";
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";
import { drawCanvas } from "./drawCanvas";
import flower from "../img/flower.png";
import zannnenn from "../img/残念.png";
import 大凶 from "../img/大凶.png";
import 凶 from "../img/凶.png";
import 末吉 from "../img/吉.png";
import 小吉 from "../img/末吉.png";
import 中吉 from "../img/小吉.png";
import 吉 from "../img/中吉.png";
import 大吉 from "../img/大吉.png";
import { omikujiLogic } from "./omikujiLogic";

export const Omikuji = ({ children }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let [omikujiword, setOmikujiword] = useState("");
  const [omikujiImage, setOmikujiImage] = useState(null);
  let [omikujiResult, setOmikujiResult] = useState("");
  let [showImage, setShowImage] = useState(false);
  const onResults = useCallback((results) => {
    const canvasCtx = canvasRef.current.getContext("2d");
    if (results.segmentationMask) {
      drawCanvas(canvasCtx, results);
      setOmikujiResult(omikujiLogic(canvasCtx, results));
    }
  }, []);
  useEffect(() => {
    if (omikujiResult !== "" && omikujiword === "") {
      setShowImage(true);
      setTimeout(() => {
        setShowImage(false);
        setOmikujiword("");
        setOmikujiResult("");
      }, 6000); // n秒後に画像を非表示にする
    }
  }, [omikujiResult]);
  const setResult = (result) => {
    setOmikujiword(result);
    if (omikujiResult === "大吉") setOmikujiImage(大吉);
    else if (omikujiResult === "吉") setOmikujiImage(吉);
    else if (omikujiResult === "中吉") setOmikujiImage(中吉);
    else if (omikujiResult === "小吉") setOmikujiImage(小吉);
    else if (omikujiResult === "末吉") setOmikujiImage(末吉);
    else if (omikujiResult === "凶") setOmikujiImage(凶);
    else if (omikujiResult === "大凶") setOmikujiImage(大凶);
  };
  useEffect(() => {
    if (showImage) {
      console.log(omikujiResult);
      setResult(omikujiResult);
    }
  }, [showImage]);
  // 初期設定
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults(onResults);
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, [onResults]);
  return (
    <>
      {children}

      <div className={styles.container}>
        {/* capture */}
        <Webcam
          audio={false}
          style={{ visibility: "hidden" }}
          width={1280}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
        />
        {/* draw */}
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={1280}
          height={720}
        />
        {showImage && (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundColor: "rgba(0, 0, 0, 0.8)",
              backgroundColor:
                omikujiword === "大凶" || omikujiword === "凶"
                  ? "rgba(200, 200, 200, 0.8)"
                  : "rgba(255, 255, 255, 0.8)",
              zIndex: 999,
            }}
          >
            <img
              src={
                omikujiword === "大凶" || omikujiword === "凶"
                  ? zannnenn
                  : flower
              }
              alt=""
              className={css`
                scale: 0;
                animation: ${omikujiword === "大凶" || omikujiword === "凶"
                    ? imgZoomBad
                    : imgZoomGood}
                  5s ease;
                animation-delay: 1s;
              `}
              style={{
                display: "block",
                margin: "auto",
                maxWidth: "80%",
                maxHeight: "80%",
                marginTop: "5%",
              }}
            />
            <img
              src={omikujiImage}
              className={css`
                scale: 0;
                animation: ${omikujiword === "大凶" || omikujiword === "凶"
                    ? textAnimationBad
                    : textAnimationGood}
                  5s ease;
                animation-delay: 1s;
              `}
              style={{
                position: "absolute",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

const imgZoomGood = keyframes`
  0%{
    scale: 0;
  }
  3%{
    scale: 0;
  }
  8%{
    scale:0.9;
  }
  90%{
    scale: 1;
  }
  97%{
    scale: 1.1;
  }
  100%{
    scale:0;
  }
`;

const imgZoomBad = keyframes`
  0%{
    scale: 1;
    opacity: 0;
    transform:translateY(-8px);
  }
  8%{
    scale: 1;
    opacity: 0;
    transform:translateY(-8px);
  }
  16%{
    opacity: 1;
    transform:translateY(0px);
  }
  90%{
    opacity: 1;
    transform:translateY(0px);
  }
  100%{
    scale: 1;
    opacity: 0;
    transform:translateY(-8px);

  }
`;

const textAnimationGood = keyframes`
  0%{
    transform:translateY(-100vh);
    scale: 0.4;
  }
  3%{
    transform: translateY(8px);
    scale:0.4;
  }
  8%{
    transform: translateY(0px);
    scale: 1.5;
  }
  90%{
    scale: 1.6;
  }
  97%{
scale: 1.7;
  }
  100%{
    scale:0;
  }
`;

const textAnimationBad = keyframes`
0%{
    transform:translateY(-100vh);
    scale: 1;
  }
  8%{
    transform: translateY(0px);
  }
  90%{
    opacity: 1;
    transform:translateY(0px);
  }
  100%{
    scale: 1;
    opacity: 0;
    transform:translateY(-8px);
  }
`;
// ==============================================
// styles
const styles = {
  container: css`
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  canvas: css`
    position: absolute;
    width: 1280px;
    height: 720px;
    background-color: #ffffff;
    z-index: -1;
  `,
  canvas2: css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400;
    border: 2px solid #000;
    box-shadow: 24px;
    padding: 4px;
  `,
  buttonContainer: css`
    position: absolute;
    top: 20px;
    left: 20px;
  `,
  button: css`
    color: #fff;
    background-color: #0082cf;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    padding: 10px 10px;
    cursor: pointer;
  `,
};
