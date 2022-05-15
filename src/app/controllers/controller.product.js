const {
  mogooseToOject,
  multipleMogooseToOject,
} = require("../middlewares/softmiddlewares");
const Product = require("../models/model.product");
const cloudinary = require("cloudinary");
const stripe = require("stripe")(
  "sk_test_51JySLPE1gyj8AlTxUqD18ZhIUyb7ydlqWWA5gDDnKf6uJrMxVqn8Bjnf8PwBr7pepYggex44n4xj7gyweROfux96009XrAeXRI"
);
const uuid = require("uuid").v4;
const ApiFeatures = require("../util/apiFeatures");

class ProductController {
  //todo: [GET]/:slug
  show(req, res, next) {
    Product.findOne({ slug: req.params.slug })
      .then((product) => res.json(mogooseToOject(product)))
      .catch((error) => next(error));
  }

  //todo: [GET]/products
  index(req, res, next) {
    var page = req.query.page;
    const PAGE_SIZE = 8;
    if (page) {
      page = parseInt(page);
      var quanlity = (page - 1) * PAGE_SIZE;
      Product.find({})
        .sort({ updatedAt: "desc" })
        .skip(quanlity)
        .limit(PAGE_SIZE)
        .then((product) => {
          Product.countDocuments({}).then((total, error) => {
            var totalSum = Math.ceil(total / PAGE_SIZE);
            res.json({
              totalSum,
              success: true,
              message: "success",
              product,
              total
            });
          });
        })
        .catch((error) => next(error));
    } else {
      Product.find({})
        .then((product) => {
          res.json({
            product,
          });
        })
        .catch((error) => res.json({ err: "lỗi" }));
    }
  }

  //todo: [POST]/product/create
  store(req, res, next) {
    const formData = req.body;
    cloudinary.v2.uploader.upload(
      formData.image,
      {
        folder: "homeless_pro",
        use_filename: true,
      },
      function (error, result) {
        const dataProduct = {
          ...formData,
          image: {
            public_id: result.public_id,
            url: result.url,
          },
        };
        const product = new Product(dataProduct);
        product.save();
      }
    );
    res.json({
      success: true,
      message: "Product created successfully",
    });
  }

  //todo: [PUT]/product/update
  update(req, res, next) {
    const formData = req.body;
    Product.updateOne({ _id: req.params.id }, formData)
      .then((product) => {
        res.json({ product, success: true });
      })
      .catch((error) => next(error));
  }

  //todo: [DELETE]
  destroy(req, res, next) {
    Product.delete({ _id: req.params.id })
      .then(() => res.json({ success: true }))
      .catch((error) => next(error));
  }

  //todo: GET/trash
  trashDestroy(req, res, next) {
    var page = req.query.page;
    const PAGE_SIZE = 6;
    if (page) {
      page = parseInt(page);
      var quanlity = (page - 1) * PAGE_SIZE;
      Product.findDeleted({})
        .sort({ updatedAt: "desc" })
        .skip(quanlity)
        .limit(PAGE_SIZE)
        .then((product) => {
          Product.countDocuments({}).then((total, error) => {
            var totalSum = Math.ceil(total / PAGE_SIZE);
            res.json({
              totalSum,
              success: true,
              message: "success",
              product,
            });
          });
        })
        .catch((error) => next(error));
    } else {
      Product.findDeleted({})
        .then((product) => {
          res.json({
            product,
          });
        })
        .catch((error) => res.json({ err: "lỗi" }));
    }
  }

  //todo [PATCH] /restore/:id
  restore(req, res, next) {
    Product.restore({ _id: req.params.id })
      .then(() => {
        res.json({ success: true });
      })
      .catch(next);
  }

  //todo [DELETE] /force/:id
  forceDestroy(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then((product) => {
        res.json({ product });
      })
      .catch(next);
  }

  //todo: [PUT]/review/:id
  review(req, res, next) {
    const reviews1 = req.body;
    const newCmt = req.body.reviews;
    Product.findById({ _id: req.params.id }).then((product) => {
      if (product.reviews.length == 0) {
        Product.updateOne({ _id: req.params.id }, reviews1).then(() =>
          res.json({ success: true })
        );
      } else {
        const findCMT = product.reviews.find(
          (review) => reviews1.reviews.email == review.email
        );
        if (findCMT) {
          product.reviews.forEach((rvw) => {
            // console.log(rvw.email === reviews1.reviews.email);
            if (rvw.email === reviews1.reviews.email) {
              rvw.rating = reviews1.reviews.rating;
              rvw.comment = reviews1.reviews.comment;
              product.save();
            }
          });
        } else {
          product.reviews.push(newCmt);
          // console.log(product.reviews);
          product.save();
        }
      }
    });
  }

  //todo: [POST]
  chechout(req, res, next) {
    let error;
    let status;
    try {
      const { product, token } = req.body;
      stripe.customers
        .create({
          email: token.email,
          source: token.id,
        })
        .then((customer) => {
          const idempotencyKey = uuid();
          const charge = stripe.charges.create(
            {
              amount: product.price * 100,
              currency: "usd",
              customer: customer.id,
              receipt_email: token.email,
              description: `${product.name}`,
              shipping: {
                name: token.card.name,
                address: {
                  line1: token.card.address_line1,
                  line2: token.card.address_line2,
                  city: token.card.address_city,
                  country: token.card.address_country,
                  postal_code: token.card.address_zip,
                },
              },
            },
            {
              idempotencyKey,
            }
          );
          // console.log("Charge:", { charge });
          status = "success";
        });
    } catch (error) {
      // console.error("Error:", error);
      status = "failure";
    }

    res.json({ error, status });
  }
}

module.exports = new ProductController();
