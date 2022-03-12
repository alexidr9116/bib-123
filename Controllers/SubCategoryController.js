const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Response = require("../Helpers/Response");
var subCaletgoryModel = require("../Models/SubcategoryModel");
const path = require("path");
const fs = require("fs");
var objectID = mongoose.Types.ObjectId;

const insert = async (req, res, next) => {
  if (req.file) {
    var result = validationResult(req);
    if (!result.isEmpty()) {
      fs.unlink(path.resolve(req.file.path), (err) => {});
      return Response.error(res, result.array()[0].msg);
    }
    try {
      var category = new subCaletgoryModel({
        name: req.body.name.toLowerCase(),
        image: req.file ? req.file.path : "",
        category:req.body.category.toLowerCase(),
      });
      var isExists = await subCaletgoryModel.isExists(req.body.name);
      if (isExists) {
        return Response.error(res, "Category is already exists.");
      }
      category.save((err) => {
        if (err) return Response.error(res, err.message, null);
        return Response.ok(res, "Category added successfully.", category);
      });
    } catch (error) {
      Response.error(res, error);
    }
  } else {
    Response.error(res, "image is required, please add category image.");
  }
};

const update = async (req, res, next) => {
  var id = req.params.id;
 
  var uploadedFile = false;
  if (req.file) {
    uploadedFile = true;
    var result = validationResult(req);
    if (!result.isEmpty()) {
      fs.unlink(path.resolve(req.file.path), (err) => {});
      return Response.error(res, result.array()[0].msg);
    }
  }
  try { 
    var isExists = await subCaletgoryModel.isExistsforModify(req.body.name, id);
    if (isExists) {
      return Response.error(res, "Category is already exists.");
    }
    else{
      const category = await subCaletgoryModel.findById(id);
      category.name = req.body.name;
      category.active = req.body.active;
      category.category = req.body.category;
      if(uploadedFile){
        const imageUrl = category.image;
        
        if (imageUrl.length>0) {
          fs.unlink(path.resolve(imageUrl), (err) => {});
        }
         
        category.image = req.file.path;

      } 
      await category.save();
      return Response.ok(res, "Category was updated.",category);
    }
  } catch (error) {  
    Response.error(res, error);
  }
   
};

const getall = (req, res, next) => {
  try {
    return new Promise(async (resolve, reject) => {
      await subCaletgoryModel.find().then((result) => {
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

const getNameList = (req, res, next) => {
  try {
    return new Promise(async (resolve, reject) => {
      await subCaletgoryModel
        .find({ active: true })
        .select("_id name image category")
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
      return Response.error(res, "no any record found.");
    }
    return new Promise(async (resolve, reject) => {
     
      var category = await subCaletgoryModel.findById(id);
       
      if (category!=null) {
        const imageUrl = category.image;
        await category.remove();
        if (imageUrl.length>0) {
          fs.unlink(path.resolve(imageUrl), (err) => {});
        }
        resolve(Response.ok(res, "removed successfully."));
      } else {
        resolve(Response.ok(res, "no any record found."));
      }
    });
  } catch (error) {
    Response.error(res, error);
  }
};

const getInfo = (req, res, next) => {
  try {
    var id = req.params.id;
    if (!objectID.isValid(id)) {
      return Response.error(res, "no any record found.");
    }
    return new Promise(async (resolve, reject) => {
      var isExists = await subCaletgoryModel.isExistsById(id);
      if (isExists) {
        subCaletgoryModel.find({_id : id}, (err, data) => {
          if (err) resolve(Response.error(res, err));
          resolve(Response.ok(res, "data retrieved successfully.", data[0]));
        });
      } else {
        resolve(Response.ok(res, "no any record found."));
      }
    });
  } catch (error) {
    Response.error(res, error);
  }
};

module.exports = {
  insert,
  update,
  getall,
  getNameList,
  remove,
  getInfo,
};
