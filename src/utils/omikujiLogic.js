import { Results } from "@mediapipe/pose";

export const getIsHandSettled = (ctx, results) => {
  if (results.poseLandmarks) {
    var Lhand = results.poseLandmarks[19];
    var Rhand = results.poseLandmarks[20];
    if (
      Math.abs(Lhand.x - Rhand.x) < 0.1 &&
      Math.abs(Lhand.y - Rhand.y) < 0.1 &&
      Math.abs(Lhand.z - Rhand.z) < 0.1
    ) {
      return true;
    } else return false;
  } else return false;
};

export const omikujiLogic = (ctx, results) => {
  if (results.poseLandmarks) {
    var Lhand = results.poseLandmarks[19];
    var Rhand = results.poseLandmarks[20];
    if (
      Math.abs(Lhand.x - Rhand.x) < 0.1 &&
      Math.abs(Lhand.y - Rhand.y) < 0.1 &&
      Math.abs(Lhand.z - Rhand.z) < 0.1
    ) {
      var omikujiResult = omikujiOutput();
      return omikujiResult;
    } else return "";
  } else return "";
};

export const omikujiOutput = () => {
  const list = ["大吉", "吉", "中吉", "小吉", "末吉", "凶", "大凶"];
  var random = Math.floor(Math.random() * list.length);
  return list[random];
};
