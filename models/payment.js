const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payment = new Schema({
    startTime: {type:String, required: true},
    endTime: {type:String},
    pricePerHour: {type:String, required: true},  
    parkingLocation: {type:String, required: true},
    phoneToPay: {type:String, required: true},
    clientPhone: {type:String, required: true},
    parkingName: {type:String, required: true}
})

module.exports=mongoose.model("payment", payment)