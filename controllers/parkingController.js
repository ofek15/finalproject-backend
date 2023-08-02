const Parking = require("../models/parking");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const fetchParking = async (req, res) => {
  try {
    const allParking = await Parking.find({});
    res.status(200).json(allParking);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const API_KEY = "AIzaSyBG1NzDqiYX9i52WMEJX-_5fSVvPlKl-lA";
const isTimeInRange = (startTime, endTime) => {
  const currentTimeObj = new Date();
  const startTimeArr = startTime.split(":");
  const endTimeArr = endTime.split(":");

  // Create Date objects with the same date, but different hours and minutes
  const currentDateTime = new Date(
    currentTimeObj.getFullYear(),
    currentTimeObj.getMonth(),
    currentTimeObj.getDate(),
    currentTimeObj.getHours(),
    currentTimeObj.getMinutes()
  );
  const startDateTime = new Date(
    currentTimeObj.getFullYear(),
    currentTimeObj.getMonth(),
    currentTimeObj.getDate(),
    parseInt(startTimeArr[0]),
    parseInt(startTimeArr[1])
  );
  const endDateTime = new Date(
    currentTimeObj.getFullYear(),
    currentTimeObj.getMonth(),
    currentTimeObj.getDate(),
    parseInt(endTimeArr[0]),
    parseInt(endTimeArr[1])
  );

  // Check if the current time is after or equal to the start time
  // and before or equal to the end time
  if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
    return true;
  }

  return false;
};

const availableParkingAndDistance = async (req, res) => {
  try {
    const allAvailableParking = await Parking.find({ availableToPark: true });
    const availableAndTime = allAvailableParking.filter((parking) =>
      isTimeInRange(parking.availableStart, parking.availableEnd)
    );
    const withDistance = []
    const lat = req.body.lat;
    const lng = req.body.lng;
    const myLocation = `${lat},${lng}`;
    for (let i = 0; i < availableAndTime.length; i++) {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            origins: myLocation, // Pass the combined location string
            destinations: `${availableAndTime[i].lat},${availableAndTime[i].lng}`, // Combine lat and lng for each available parking
            travelMode: "DRIVING",
            key: API_KEY,
          },
        }
      );
      console.log(response.data.rows[0].elements[0].distance.text);
      const distance = response.data.rows[0].elements[0].distance;
      const duration = response.data.rows[0].elements[0].duration;
      const distanceText = distance ? distance.text : "N/A";
      const distanceValue = distance ? distance.value : 100000000;
      const timeText = duration ? duration.text : 'N/A';
      const timeValue = duration ? duration.value : 100000000;
      availableAndTime[i].distanceText = distanceText;
      availableAndTime[i].distanceValue = distanceValue;
      const obj = {
        parkingName: availableAndTime[i].parkingName,
        parkingLocation: availableAndTime[i].parkingLocation,
        lat: availableAndTime[i].lat,
        lng: availableAndTime[i].lng,
        photos: availableAndTime[i].photos,
        availableToPark: availableAndTime[i].availableToPark,
        availableStart: availableAndTime[i].availableStart,
        availableEnd: availableAndTime[i].availableEnd,
        pricePerHour: availableAndTime[i].pricePerHour,
        ownerID: availableAndTime[i].ownerID,
        whoIsParking: availableAndTime[i].whoIsParking,
        comments: availableAndTime[i].comments,
        distanceText: distanceText,
        distanceValue: distanceValue,
        timeText: timeText,
        timeValue: timeValue
      }
      console.log(obj);
      withDistance.push(obj)
    }
    // console.log(withDistance);
    res.status(200).json(withDistance);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const availableParking = async (req, res) => {
  try {
    const allAvailableParking = await Parking.find({ availableToPark: true });
    const availableAndTime = allAvailableParking.filter((parking) =>
      isTimeInRange(parking.availableStart, parking.availableEnd)
    );
    res.status(200).json(availableAndTime);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const findOneParking = async (req, res) => {
  try {
    const parking = await Parking.findById({ _id: req.body._id });
    res.status(200).json(parking);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

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
      availableEnd: req.body.availableEnd,
      pricePerHour: req.body.pricePerHour,
      lng: req.body.lng,
      lat: req.body.lat,
      ownerID: req.body.ownerID,
      whoIsParking: null,
      comments: req.body.comments,
    });
    console.log("dngjr");
    const updatearrayofParkings = await User.updateOne(
      { _id: req.body.ownerID },
      { $push: { myParking: newParking } },
      { new: true }
    );
    return res.status(200).json(updatearrayofParkings);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteParking = async (req, res) => {
  console.log(req.body._id);
  try {
    await Parking.findByIdAndDelete(req.body._id);
    res.status(200).send("Parking was deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateParking = async (req, res) => {
  console.log(req.body);
  const parkingStatus = await Parking.findById(req.body._id);
  if (parkingStatus.availableToPark) {
    try {
      const updateParking = await Parking.findByIdAndUpdate(req.body._id, {
        availableStart: req.body.availableStart,
        availableEnd: req.body.availableEnd,
        pricePerHour: req.body.pricePerHour,
      });
      console.log(updateParking);
      res.status(200).json(updateParking);
    } catch (err) {
      res.status(500).json(err.message);
      console.log(err.message);
    }
  } else {
    return res.status(404).json("cant change while parking");
  }
};

module.exports = {
  fetchParking,
  publishParking,
  deleteParking,
  updateParking,
  findOneParking,
  availableParking,
  availableParkingAndDistance,
};
