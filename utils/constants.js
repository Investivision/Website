const production = false;

module.exports = {
  socketIOEndpoint: production ? "herokuurl" : "http://localhost:5000/",
};
