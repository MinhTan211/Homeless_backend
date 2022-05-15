const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/controller.product");

router.post("/store", productController.store);
router.put("/update/:id", productController.update);
router.get("/trash", productController.trashDestroy);
router.post("/create-chechout", productController.chechout);
router.patch("/restore/:id", productController.restore);
router.delete("/:id", productController.destroy);
router.put("/review/:id", productController.review);
router.delete("/force/:id", productController.forceDestroy);
router.get("/:slug", productController.show);
router.get("/", productController.index);

module.exports = router;
