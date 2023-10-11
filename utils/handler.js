const { consoleLog } = require("./logs");

class CustomError {
  constructor(error, errorAPI = "NA", errorCode = 500) {
    this.errorType = errorCode === 500 ? `Server Error` : `Client Error`;
    this.errorMsg = `${this.errorType}: ${error}`;
    this.errorCode = errorCode;
    this.errorAPI = errorAPI.trim();
    this.error = error;
  }

  setErrorMsg() {
    try {
      if (this.error?.isjoi || this.error?.name === "ValidationError") {
        this.errorCode = 422;
        if (this.error?.errors) {
          this.errorMsg = Object.values(this.error?.errors)?.map(
            (val) => `Mongoose Validation Error: ${val?.message}`
          );
        } else {
          this.errorMsg = `Joi ${this.error} => Passed Data: ${JSON.stringify(
            this.error?._original
          )}`;
        }
      } else if (this.error?.name === "MongoServerError") {
        if (this.error?.code === 11000) {
          this.errorMsg = `Mongo Duplicate Error: ${
            Object.keys(this.error?.keyValue)[0]
          } already exists`;
        } else {
          this.errorMsg = `Mongo Server Error: ${this.error}`;
        }
      }
    } catch (error) {
      this.errorCode = 500;
      this.errorMsg = `UnExpected Server Error: ${error}`;
    }
  }

  sendLogs() {
    const errorObj = {};
    errorObj.error = "UnExpected Server Error";
    errorObj.api = this.errorAPI;
    errorObj.code = this.errorCode;
    if (this.errorCode === 500) errorObj.error = "Server Error";
    if (this.errorCode >= 400 && this.errorCode < 500) {
      errorObj.error = "Client Error";
    }
    consoleLog(this.errorMsg, "error", errorObj);
  }

  async handleError(printLogs = false) {
    this.setErrorMsg();
    if (printLogs) this.sendLogs();

    return {
      errorMsg: this.errorMsg?.toString(),
      errorCode: this.errorCode?.toString(),
    };
  }
}

module.exports.catchHandler = async (res, req, error = "") => {
  const errorAPI = `${req.method}: ${req.originalUrl} ${
    req?.decoded?.user_id ? `(${req?.decoded?.user_id})` : ""
  }`;
  const errorObj = new CustomError(error, errorAPI, 500);
  const { errorMsg, errorCode } = await errorObj.handleError(true, true, true);

  return res.status(Number(errorCode)).json({
    error: errorMsg,
    errorAPI,
  });
};

module.exports.responseHandler = (res, message = "Success", data = null) => {
  res.status(200).json({ message, data });
};

module.exports.errorHandler = async (res, error = "", errorCode = 400) => {
  const errorObj = new CustomError(error, "NA", errorCode);
  const { errorMsg } = await errorObj.handleError(true);

  return res.status(Number(errorCode)).json({
    error: errorMsg,
  });
};
