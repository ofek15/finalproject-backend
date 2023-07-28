const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payment = new Schema({
    parkingId:{type:String, required: true},
    parkName:{type:String, required: true},
    startTime: {type:String, required: true},
    endTime: {type:String},
    pricePerHour: {type:String, required: true},  
    parkingLocation: {type:String, required: true},
    phoneToPay: {type:String, required: true},
    clientPhone: {type:String, required: true},
    date: {type: Date, default: Date.now,},
    finalPrice: {type:String}
})

module.exports=mongoose.model("payment", payment)