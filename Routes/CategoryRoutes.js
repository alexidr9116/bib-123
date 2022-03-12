const express = require("express"); 
const categoryController = require("../Controllers/CategoryController");
const subCategoryController = require("../Controllers/SubCategoryController"); 
var router = express.Router();


router.get("/all", categoryController.getall);
router.get("/list", categoryController.getNameList);
router.get("/:id", categoryController.getInfo);

router.get("/sub/all",subCategoryController.getall)
router.get("/sub/list", subCategoryController.getNameList);
router.get("/sub/:id", subCategoryController.getInfo);
module.exports = router;