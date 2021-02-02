const Vips = require("../data/Vips");

const getVip = function (number) {
  return Vips[number.toString()];
};

module.exports = {
  getVip,
};
