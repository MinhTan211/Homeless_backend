const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/homeless_petshop");
    console.log("connect successfully");
  } catch (err) {
    console.log("Faild");
  }
}

module.exports = { connect };
