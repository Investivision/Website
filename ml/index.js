// import * as tf from "@tensorflow/tfjs";
import ***REMOVED*** Main ***REMOVED*** from "next/document";

const main = async () => ***REMOVED***
  const model = await tf.loadLayersModel("/model/model.json");
  const saveResults = await model.save("indexeddb://model");
  //   await tf.io.copyModel("/model/model.json", "indexeddb://model");
***REMOVED***;

main();

module.exports.predict = async (data, ***REMOVED*** train = true ***REMOVED***) => ***REMOVED***
  const model = await tf.loadLayersModel("indexeddb://model");
  if (train == true) ***REMOVED***
    await model.fit(data["inputs"], data["outputs"], ***REMOVED***
      batchSize: 50,
      epochs: 10,
    ***REMOVED***);
  ***REMOVED***
  return await model.predictOnBatch(data["predictionInput"]).array();
***REMOVED***;
