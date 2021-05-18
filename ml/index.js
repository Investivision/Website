// import * as tf from "@tensorflow/tfjs";
import { Main } from "next/document";

const main = async () => {
  const model = await tf.loadLayersModel("/model/model.json");
  const saveResults = await model.save("indexeddb://model");
  //   await tf.io.copyModel("/model/model.json", "indexeddb://model");
};

main();

module.exports.predict = async (data, { train = true }) => {
  const model = await tf.loadLayersModel("indexeddb://model");
  if (train == true) {
    await model.fit(data["inputs"], data["outputs"], {
      batchSize: 50,
      epochs: 10,
    });
  }
  return await model.predictOnBatch(data["predictionInput"]).array();
};
