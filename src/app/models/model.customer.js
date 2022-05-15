const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customer = new Schema(
  {
    name: { type: String, default: null },
    email: {
      type: String,
      maxLength: [200, "Độ dài tối đa là 200 kí tự"],
    },
    numberphone: { type: Number, default: 0828 },
    gender: { type: Number, default: 0 },
    birthday: { type: Date, default: null },
    image: {
      public_id: {
        type: String,
        default:0
      },
      url: {
        type: String,
        default:0
      },
    },
    address: { type: String, maxLength: 300, default: null },
    id: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", Customer);
