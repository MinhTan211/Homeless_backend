const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/controller.user");
const authenToken = require("../app/middlewares/middleware.authenToken");

router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/signin", userController.store);
router.put("/update/:id", userController.update);
router.get("/:id", userController.show);
router.get("/", userController.index);
router.put("/password/reset/:token", userController.resetPassword);
router.post("/password/forgot", userController.forgotPassword);
//getuserdetails
//getalluser
//getsingleuser()
//deleteuser()

module.exports = router;
