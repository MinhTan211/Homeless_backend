const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

const Product = new Schema(
  {
    name: { type: String, maxlength: 50 },

    description: { type: String, maxlength: 200 },

    sold: { type: Number, default: 0 },

    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    classify: {
      name: { type: String, maxlength: 500 },
      price: { type: Number },
    },

    slug: { type: String, slug: "name", unique: true },

    discount: { type: Number, default: 0 },

    Stock: { type: Number, default: 1 },

    reviews: [
      {
        email: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//todo Add plugin
mongoose.plugin(slug);

Product.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Product", Product);
