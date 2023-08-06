const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    username: {type:String, required: true, unique: true},
    password: {type:String, required: true, unique: true},
    firstName: {type:String, required: true},
    lastName: {type:String, required: true},  
    email: {type:String, required: true},
    phoneNumber: {type:String, required: true},
    currentParking: {type:Boolean},
    myParking: [{type: mongoose.Types.ObjectId, ref: "parking"}],
    myPayment: [{type: mongoose.Types.ObjectId, ref: "payment"}] ,   
    licensePlates: [{type:String}],
    activeLicense: {type:String},
    totalEarn: {type:Number}  
})

module.exports=mongoose.model("user", user)