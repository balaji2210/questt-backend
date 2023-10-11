const jwt = require("jsonwebtoken");
const { errorHandler, catchHandler } = require("../utils/handler");

module.exports.authenticateUser = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.token ||
      req?.header("Authorization")?.replace("Bearer ", "") ||
      null;

    console.log(">>", req?.cookies);

    if (!token) return errorHandler(res, "Authentication Failed", 401);

    let decoded = null;

    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      return catchHandler(res, req, error);
    }

    req.decoded = decoded;
    next();
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
