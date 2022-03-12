const mongoose = require('mongoose');

const SubcategorySchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    category : {type : mongoose.Types.ObjectId, ref: "Categories"},
    name : {type : String, default : "", minLength : 3, maxLength : 255, lowercase : true},
    image : {type : String, default : ""},
    active : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
});

class SubCategoryClass {
    static async isExists(category) {
      var result = false;
      const data = await this.findOne({ name: category }).exec();
      if (data) result = true;
      return result;
    }
    static async isExistsforModify(category, id) {
      
      var result = false;
      const data = await this.findOne({ name: category, _id : { $ne: id} }); 
      if (data) result = true;
      return result;
    }
    static async isExistsById(id) {
      var result = false;
      const data = await this.findOne({ _id: id }).exec();
      if (data) result = true;
      return result;
    }
  }
  SubcategorySchema.loadClass(SubCategoryClass);
const Subcategories = mongoose.model("Subcategories", SubcategorySchema);
module.exports = Subcategories;