const mongoose = require("mongoose");

module.exports.DB = () => {
  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`DB CONNECTED`))
    .catch((err) => console.log("err>>", err));
};
