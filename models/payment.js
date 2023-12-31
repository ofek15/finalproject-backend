const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payment = new Schema({
    parkingId:{type:String, required: true},
    ownerParkingId:{type:String, required: true},
    parkName:{type:String, required: true},
    startTime: {type:String, required: true},
    endTime: {type:String},
    pricePerHour: {type:String, required: true},  
    parkingLocation: {type:String, required: true},
    phoneToPay: {type:String, required: true},
    clientPhone: {type:String, required: true},
    clientName: {type:String, required: true},
    date: {type: String},
    finalPrice: {type:String}
})

module.exports=mongoose.model("payment", payment)