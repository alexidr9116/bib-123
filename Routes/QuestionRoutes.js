const express = require("express"); 
const questionController = require("../Controllers/QuestionController");
var router = express.Router();


router.get("/all", questionController.getAll);
router.get("/list", questionController.getNameList);
router.get("/:id", questionController.getOne);

module.exports = router;