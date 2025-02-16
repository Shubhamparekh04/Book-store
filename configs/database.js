const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb+srv://shubhamparekh04:12345@cluster0.updlh.mongodb.net/book-store");

const db = mongoose.connection;

db.on("connected", (err) => {
  if (!err) {
    console.log("Database Connected...!");
  } else {
    console.log(err, "Database not connected");
  }
});

module.exports = db;
