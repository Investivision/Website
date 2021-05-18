import { production } from "./production";

module.exports = {
  socketIOEndpoint: production ? "herokuurl" : "http://192.168.1.225:5000/",
};
