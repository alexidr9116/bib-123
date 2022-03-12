const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Response = require("../Helpers/Response");
const QuestionModel = require("../Models/QuestionModel");
const path = require("path");
const fs = require("fs");
const QuestionsDataModel = require("../Models/QuestionDataModel");
const objectID = mongoose.Types.ObjectId;

const add = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  try { 
    const instance = new QuestionModel({
      ...req.body
    });
    var isExists = await QuestionModel.isExists(req.body.title);
    if (isExists) {
      return Response.error(res, "Question is already exists.");
    }
    instance.save((err) => {
      if (err) return Response.error(res, err.message, null);
     
      return Response.ok(res, "QuestionModel added successfully.", instance);
    });
  } catch (error) {
    Response.error(res, error);
  }

};

const update = async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var id = req.params.id;
  try {
    var isExists = await QuestionModel.isExistsforModify(req.body.title, id);
    if (isExists) {
      return Response.error(res, "Category is already exists.");
    }
    else {
      const instance = await QuestionModel.findById(id);
      instance.title = req.body.title;
      instance.active = req.body.active;
      instance.type = req.body.type;
      instance.isRequired = req.body.isRequired;
      instance.options = req.body.options;
      await instance.save();
      return Response.ok(res, "Category was updated.", instance);
    }
  } catch (error) {
    Response.error(res, error);
  }

};
// need admin side
const getAll = (req, res, next) => {
  try {
    return new Promise(async (resolve, reject) => {
      await QuestionModel.find().then((result) => {
        if (result && result.length > 0) {
          return resolve(
            Response.ok(res, "data retrieved successfully.", result)
          );
        } else {
          return resolve(Response.ok(res, "data not found."),[]);
        }
      });
    });
  } catch (error) {

    Response.error(res, error);
  }
};

const getNameList = (req, res, next) => {
  try {
    return new Promise(async (resolve, reject) => {
      await QuestionModel
        .find({ active: true })
        .select("_id title type isRequired active")
        .then((result) => {
          if (result && result.length > 0) {
            return resolve(
              Response.ok(res, "data retrieved successfully.", result)
            );
          } else {
            return resolve(Response.ok(res, "data not found."));
          }
        });
    });
  } catch (error) {
    Response.error(res, error);
  }
};

const remove = (req, res, next) => {
   
  try {
    var id = req.params.id;
    if (!objectID.isValid(id)) {
      return Response.error(res, "invalid record id");
    }
    return new Promise(async (resolve, reject) => {
      var question = await QuestionModel.findById(id);
      if (question != null) {
        await question.remove();
        resolve(Response.ok(res, "removed successfully."));
      } else {
        resolve(Response.ok(res, "no any record found."));
      }
    });
  } catch (error) {
    Response.error(res, error);
  }
};

const getOne = (req, res, next) => {
  try {
    var id = req.params.id;
    if (!objectID.isValid(id)) {
      return Response.error(res, "invalid record number");
    }
    return new Promise(async (resolve, reject) => {

      QuestionModel.find({ _id: id }, (err, data) => {
        if (err) resolve(Response.error(res, err));
        if (data == null || data.length == 0)
          resolve(Response.ok(res, "no any record found."));
        resolve(Response.ok(res, "data retrieved successfully.", data[0]));
      });
    });
  } catch (error) {
    Response.error(res, error);
  }
};

module.exports = {
  add,
  update,
  getAll,
  getNameList,
  remove,
  getOne,
};
