const jwt = require("jsonwebtoken");
const { errorHandler, catchHandler } = require("../utils/handler");

module.exports.authorMiddleware = async (req, res, next) => {
  try {
    const token = req?.cookies?.token || null;

    if (!token) return errorHandler(res, "Authentication Failed", 401);

    let decoded = null;

    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      return catchHandler(res, req, error);
    }

    if (!(decoded.userType === "author")) {
      return errorHandler(
        res,
        `Authentication Failed: Invalid UserType ${decoded?.userType}`,
        401
      );
    }
    req.decoded = decoded;
    next();
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
