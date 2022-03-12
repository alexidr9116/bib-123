const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    title : {type : String, default : "", minLength : 3, maxLength : 255, lowercase : true},
    type : {type : String, default : "singleselect", enum : ["singleselect", "multiselect", "number", "text"]},
    questionName : {type :String, default : ""},
    isRequired : {type : Boolean, default : true},
    active : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
    options:{type:Array,default:[]},
});

class QuestionClass {
    static async isExists(title) {
      var result = false;
      const data = await this.findOne({ title });
      if (data) result = true;
      return result;
    }
    static async isExistsforModify(title, id) {
      
      var result = false;
      const data = await this.findOne({ title, _id : { $ne: id} }); 
      if (data) result = true;
      return result;
    }
    static async isExistsById(id) {
      var result = false;
      const data = await this.findOne({ _id: id });
      if (data) result = true;
      return result;
    }
  }
QuestionSchema.loadClass(QuestionClass);
const Questions = mongoose.model("Questions", QuestionSchema);
module.exports = Questions;