const { catchHandler, responseHandler } = require("../utils/handler");

module.exports.userConfig = async (req, res) => {
  try {
    return responseHandler(res, "User Config Data", req.decoded);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
