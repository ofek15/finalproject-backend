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
function isDateInRange(startDate, endDate) {
  const currentDate = new Date();
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  return currentDate >= startDateObj && currentDate <= endDateObj;
}

const availableParkingAndDistance = async (req, res) => {
  try {
    const date = new Date();
    const day = date.getDay()
    const allAvailableParking = await Parking.find({ availableToPark: true });
    const onlyShort = allAvailableParking.filter((parking) =>
    parking.shortTerm == true
  );
    const onlyLong = allAvailableParking.filter((parking) =>
    parking.shortTerm == false
  );
    const availableDay = onlyLong.filter((parking) =>
    parking.selectedDays[day]
  );
    const availableAndTime = availableDay.filter((parking) =>
      isTimeInRange(parking.availableStart, parking.availableEnd) 
    );
    const availableShort = allAvailableParking.filter((parking) => isDateInRange(parking.startDate, parking.endDate))
    const allAfterFilters = availableAndTime.concat(availableShort)
    const withDistance = []
    const lat = req.body.lat;
    const lng = req.body.lng;
    const myLocation = `${lat},${lng}`;
    for (let i = 0; i < allAfterFilters.length; i++) {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            origins: myLocation, // Pass the combined location string
            destinations: `${allAfterFilters[i].lat},${allAfterFilters[i].lng}`, // Combine lat and lng for each available parking
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
      allAfterFilters[i].distanceText = distanceText;
      allAfterFilters[i].distanceValue = distanceValue;
      const obj = {
        _id: allAfterFilters[i]._id,
        parkingName: allAfterFilters[i].parkingName,
        parkingLocation: allAfterFilters[i].parkingLocation,
        lat: allAfterFilters[i].lat,
        lng: allAfterFilters[i].lng,
        photos: allAfterFilters[i].photos,
        availableToPark: allAfterFilters[i].availableToPark,
        availableStart: allAfterFilters[i].availableStart,
        availableEnd: allAfterFilters[i].availableEnd,
        pricePerHour: allAfterFilters[i].pricePerHour,
        ownerID: allAfterFilters[i].ownerID,
        whoIsParking: allAfterFilters[i].whoIsParking,
        comments: allAfterFilters[i].comments,
        distanceText: distanceText,
        distanceValue: distanceValue,
        timeText: timeText,
        timeValue: timeValue
      }
      console.log(obj);
      withDistance.push(obj)
    }
    console.log(withDistance);
    withDistance.sort((a,b) => a.distanceValue-b.distanceValue)
    res.status(200).json(withDistance);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const availableParking = async (req, res) => {
  try {
    const date = new Date();
    const day = date.getDay()
    const allAvailableParking = await Parking.find({ availableToPark: true });
    const onlyShort = allAvailableParking.filter((parking) =>
    parking.shortTerm == true
  );
    const onlyLong = allAvailableParking.filter((parking) =>
    parking.shortTerm == false
  );
    const availableDay = onlyLong.filter((parking) =>
    parking.selectedDays[day]
  );
    const availableAndTime = availableDay.filter((parking) =>
      isTimeInRange(parking.availableStart, parking.availableEnd) 
    );
    const availableShort = allAvailableParking.filter((parking) => isDateInRange(parking.startDate, parking.endDate))
    const allAfterFilters = availableAndTime.concat(availableShort)
    res.status(200).json(allAfterFilters);
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

const changeStatus = async (req, res) => {
  try {
    const parking = await Parking.findById({ _id: req.body._id });
    if(parking.whoIsParking == null || parking.whoIsParking == undefined || parking.whoIsParking == "")
    {
    const changing = await Parking.findByIdAndUpdate({ _id: req.body._id }, {availableToPark: !parking.availableToPark});
    res.status(200).json(changing);
    }
  
    
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
      currentLicense: null,
      comments: req.body.comments,
      selectedDays: req.body.selectedDays,
      shortTerm: req.body.shortTerm,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
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
  console.log(parkingStatus.availableToPark);
  if (parkingStatus?.availableToPark) {
    try {
      const updateParking = await Parking.findByIdAndUpdate(req.body._id, {
        availableStart: req.body.availableStart,
        availableEnd: req.body.availableEnd,
        pricePerHour: req.body.pricePerHour,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        selectedDays: req.body.selectedDays,
        shortTerm: req.body.shortTerm,
      }, { new: true })
    console.log(updateParking);
    res.status(200).json(updateParking);
    } catch (err) {
      res.status(500).json(err.message);
      console.log(err.message);
    }
  } else {
    res.status(404).json("cant change while parking");
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
  changeStatus,
};
