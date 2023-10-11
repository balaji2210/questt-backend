const joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const {
  catchHandler,
  errorHandler,
  responseHandler,
} = require("../utils/handler");
const { userSchema } = require("../models");

module.exports.signUp = async (req, res) => {
  try {
    const schema = joi.object().keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      userType: joi.string().valid("author").allow("", null),
    });

    await schema.validateAsync(req.body);

    const { email, password, firstName, lastName, userType } = req.body;

    let user = await userSchema.findOne({ email });

    if (user) {
      return errorHandler(res, "User Already Exists", 400);
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const userObj = {
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    };

    if (userType) {
      userObj.userType = userType;
    }

    user = await userSchema.create(userObj);

    const token = jwt.sign(
      { _id: user?._id, email: user?.email, userType: user?.userType },
      process.env.SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.cookie("token", token);

    return responseHandler(res, "User Created", {
      email: user?.email,
      _id: user?._id,
      userType: user?.userType,
      token,
    });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.signIn = async (req, res) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    await schema.validateAsync(req.body);

    const { email, password } = req.body;

    let user = await userSchema.findOne({ email });

    if (!user) {
      return errorHandler(res, "User Not Found", 400);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { _id: user?._id, email: user?.email, userType: user?.userType },
        process.env.SECRET,
        {
          expiresIn: "30d",
        }
      );

      res.cookie("token", token);
      return responseHandler(res, "Login Success", {
        email: user?.email,
        _id: user?._id,
        userType: user?.userType,
        token,
      });
    } else {
      return errorHandler(res, "Invalid Email Or Password", 400);
    }
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    req.decoded = null;
    return responseHandler(res, "Logout Success", { success: true });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
