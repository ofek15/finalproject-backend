const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parking = new Schema({
    parkingName: {type:String, required: true},
    parkingLocation: {type:String, required: true},
    lat: {type:String, required: true},
    lng: {type:String, required: true},
    photos: [{type:String, required: true}],
    availableToPark: {type:Boolean, required: true},  
    availableStart: {type:String, required: true},
    availableEnd: {type:String, required: true},
    pricePerHour: {type:String, required: true},
    ownerID: {type:String, required: true},
    whoIsParking: {type:String},
    comments:{type:String},
    selectedDays: [{ type: Boolean, required: true }],
    shortTerm: { type: Boolean, required: true },
    startDate: {type:String},
    endDate: {type:String},
})

module.exports=mongoose.model("parking", parking)