const Account = require("../models/model.account");
const Customer = require("../models/model.customer");
const Authentication = require("../util/util.JWT");
const sendEmail = require("../util/senEmail");
const crypto = require("crypto");

class UserController {
  //todo: [POST]/account/login/:email&:pass
  login(req, res, next) {
    const { email, password } = req.body;
    if (email && password) {
      Account.findOne({ email: email })
        .then((account) => {
          if (account) {
            account.comparePassword(password).then((check) => {
              console.log(check);
              if (check) {
                const user = {
                  email: account.email,
                  password: account.password,
                  role: account.role,
                };
                Authentication(user, res, 201);
              } else {
                res.json({
                  success: false,
                  message: "Wrong account or password",
                });
              }
            });
          } else {
            res.json({
              success: false,
              message: "Wrong account or password",
            });
          }
        })
        .catch((error) => res.json(error));
    }
  }

  //todo: [GET]/account/logout
  logout(req, res, next) {
    res.clearCookie("token", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.json({
      success: true,
      message: "LogOut successfully",
    });
  }

  //todo: [GET]/account
  index(req, res, next) {
    Account.find({})
      .then((account) => res.json(account))
      .catch((error) => res.json(error));
  }

  //todo: [POST]/account/store
  store(req, res, next) {
    const formData = req.body;
    Account.findOne({ email: formData.email }).then((emailsingle) => {
      if (emailsingle) {
        return res.json({ message: "Gmail already exists" });
      } else {
        const account = new Account(formData);
        account.save();
        const customer = new Customer(formData);
        customer.save();
        const user = {
          email: formData.email,
          password: formData.password,
          role: 0,
        };
        return next(Authentication(user, res, 201));
      }
    });
  }

  //todo: [GET]/account/:id
  show(req, res, next) {
    Account.findOne({ _id: req.params.id })
      .then((account) => res.json(account))
      .catch((error) => res.json(error));
  }

  //todo: [PUT]/account/update/:id
  update(req, res, next) {
    const formData = req.body;
    Account.updateOne({ _id: req.params.id }, formData)
      .then(function (account) {
        Customer.updateOne({ _id: req.params.id }, formData).then(
          res.send({ redirect: "/customer/update/" + req.params.id })
        );
      })
      .catch((error) => res.json(error));
  }

  //Forgot password
  forgotPassword(req, res, next) {
    // console.log(req.body);
    Account.findOne({ email: req.body.email })
      .then((user) => {
        const resetToken = user.getResetPasswordToken();
        const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
        const message = `Click on the link to reset password :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it.`;
        sendEmail({
          email: user.email,
          subject: `HomeLess Password Recovery`,
          message,
        })
          .then(() =>
            res.status(200).json({
              success: true,
              message: `Email sent to ${user.email} successfully`,
            })
          )
          .catch((error) =>
            res.status(500).json({
              success: false,
              message: error,
            })
          );
      })
      .catch((error) => res.json(error));
  }

  resetPassword(req, res, next) {
    const aa = req.params.token;
    Account.findOne({ aa }).then((accounts) => {
      accounts.password = req.body.password;
      accounts.resetPasswordToken = undefined;
      accounts.resetPasswordExpire = undefined;

      accounts.save();
    });
  }
}

module.exports = new UserController();
