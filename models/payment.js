const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payment = new Schema({
    parkName:{type:String, required: true},
    startTime: {type:String, required: true},
    endTime: {type:String},
    pricePerHour: {type:String, required: true},  
    parkingLocation: {type:String, required: true},
    phoneToPay: {type:String, required: true},
    date: {type: Date, default: Date.now,}
})

module.exports=mongoose.model("payment", payment)