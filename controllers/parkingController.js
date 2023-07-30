const Parking = require("../models/parking");
const User = require("../models/user");
const jwt = require('jsonwebtoken')

const fetchParking= async (req, res) => {
    try {
      const allParking = await Parking.find({});
      res.status(200).json(allParking);
    } catch (err) {
      res.status(500).json(err.message);
      console.log(err.message);
    }
  };

const findOneParking = async (req, res) => {
  try{
    const parking = await Parking.findById({_id: req.body._id})
    res.status(200).json(parking);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
}

  const publishParking = async (req, res) => {
    // console.log(req.body);
    try {
      // const token = req.body.token
      // const id1 = jwt.verify(token,process.env.SECRET)
      // id=id1._id
      const newParking = await Parking.create({
        parkingName: req.body.parkingName,
        parkingLocation: req.body.parkingLocation,
        photos: req.body.photos,
        availableToPark: true,  
        availableStart: req.body.availableStart,
        availableEnd:req.body.availableEnd,
        pricePerHour:req.body.pricePerHour,
        lng: req.body.lng,
        lat:req.body.lat,
        ownerID: req.body.ownerID,
        whoIsParking: null ,
        comments:req.body.comments
      });
      console.log("dngjr");
      const updatearrayofParkings= await User.updateOne(
        {_id: req.body.ownerID},
        {$push:{myParking:newParking}},
        {new:true})
      return res.status(200).json(updatearrayofParkings);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  const deleteParking= async (req, res) => {
    console.log(req.body._id)
    try {
      await Parking.findByIdAndDelete(req.body._id);
      res.status(200).send("Parking was deleted");
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  const updateParking = async (req, res) => {
    console.log(req.body)
   const parkingStatus = await Parking.findById(req.body._id)
   if(parkingStatus.availableToPark){
    try {
      const updateParking = await Parking.findByIdAndUpdate(req.body._id, {
        availableStart: req.body.availableStart,
        availableEnd: req.body.availableEnd,
        pricePerHour: req.body.pricePerHour
    });
    console.log(updateParking);
    res.status(200).json(updateParking);
    } catch (err) {
      res.status(500).json(err.message);
      console.log(err.message);
    }
   }else{
    return res.status(404).json("cant change while parking")
   }
   
  };
  

  module.exports = {fetchParking, publishParking, deleteParking, updateParking, findOneParking};