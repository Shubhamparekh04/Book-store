const { default: mongoose } = require("mongoose");

const bookStoreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    bestseller: { type: Boolean },
  },
  { timeStamps: true }
);

const bookModel = mongoose.model("bookModel", bookStoreSchema);

module.exports = bookModel;
