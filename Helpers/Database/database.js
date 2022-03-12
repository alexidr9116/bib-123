var mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://batzorig:carpenter.123@cluster0.a9sl4.mongodb.net/test",
  // "mongodb://localhost:27017/bluelbis",
  { useNewUrlParser: false, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Database connected successfully.");
    else
      console.log(
        "Error while connecting database : " + JSON.stringify(err.message)
      );
  }
);
