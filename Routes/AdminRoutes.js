const express = require("express");
const { check } = require("express-validator");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const auth = require("../Controllers/AuthController");
const categoryController = require("../Controllers/CategoryController");
const subCategoryController = require("../Controllers/SubCategoryController");
const {
  imageUpload,
  checkAndUploadImage,
} = require("../Helpers/FileUploader/fileuploader");
const Global = require("../Helpers/Global");
const Response = require("../Helpers/Response");
const upload = imageUpload.fields([{ name: "image", maxCount: 1 }]);
const validator = require("../Helpers/Validations/Validator");
const { verifyAuth } = require("../Controllers/AuthController");
var router = express.Router();

// -------------------- categoires
router.post(
  "/category/insert",
  verifyAuth,
  [imageUpload.single("image"), validator.reqStringValidator("name")],
  categoryController.insert
);
router.put("/category/remove/:id", verifyAuth, categoryController.remove);
router.put("/category/edit-without-image/:id", verifyAuth,
  validator.reqStringValidator("name"),
  categoryController.update
);
router.put("/category/edit-with-image/:id", verifyAuth,
  [imageUpload.single("image"), validator.reqStringValidator("name")],
  categoryController.update
);
router.delete("/category/delete/:id", verifyAuth,
  categoryController.remove
);

// ------------ subcategories
router.post(
  "/category/sub/insert",
  verifyAuth,
  [imageUpload.single("image"), validator.reqStringValidator("name")],
  subCategoryController.insert
);
router.put("/category/sub/remove/:id", verifyAuth, categoryController.remove);
router.put("/category/sub/edit-without-image/:id", verifyAuth,
  validator.reqStringValidator("name"),
  subCategoryController.update
);
router.put("/category/sub/edit-with-image/:id", verifyAuth,
  [imageUpload.single("image"), validator.reqStringValidator("name")],
  subCategoryController.update
);
router.delete("/category/sub/delete/:id", verifyAuth,
subCategoryController.remove
);
module.exports = router;
