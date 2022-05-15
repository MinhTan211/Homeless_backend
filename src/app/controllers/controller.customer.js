const Customer = require("../models/model.customer");
const cloudinary = require("cloudinary");
class CustomerController {
  //todo: [GET]/customer
  index(req, res, next) {
    Customer.find({})
      .then((customer) => res.json(customer))
      .catch((error) => res.json(error));
  }

  //todo: [POST]/customer/store
  // store(req, res, next) {
  //     const accounts = req.body.da;
  //     console.log(req.data);
  //     const customer = new Customer(accounts);
  //     customer.save();
  // }

  //todo: [GET]/customer/:id
  show(req, res, next) {
    Customer.findOne({ email: req.params.email })
      .then((customer) => res.json(customer))
      .catch((error) => res.json(error));
  }

  //todo: [PUT]/customer/update/:id
  update(req, res, next) {
    const formData = req.body;
    cloudinary.v2.uploader.upload(
      formData.image,
      {
        folder: "homeless_pro",
        use_filename: true,
      },
      function (error, result) {
        const dataProduct = {
          name: formData.name,
          numberphone: formData.numberphone,
          address: formData.address,
          image: {
            public_id: result.public_id,
            url: result.url,
          },
        };
        Customer.updateOne({ email: formData.email }, dataProduct)
          .then((customer) => res.json(customer))
          .catch((error) => res.json(error));
      }
    );
  }
}

module.exports = new CustomerController();
