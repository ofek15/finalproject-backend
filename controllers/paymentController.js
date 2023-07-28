const Payment = require("../models/payment");
const User = require("../models/user");
const Parking = require("../models/parking");
const jwt = require("jsonwebtoken");

const fetchPayment = async (req, res) => {
  try {
    const allPayment = await Payment.find({});
    res.status(200).json(allPayment);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const publishPayment = async (req, res) => {
  try {
    const token = req.body.token;
    const id1 = jwt.verify(token, process.env.SECRET);
    id = id1._id;
    console.log(id);
    const newPayment = await Payment.create({
      startTime: req.body.startTime,
      endTime: null,
      pricePerHour: req.body.pricePerHour,
      parkingLocation: req.body.parkingLocation,
      phoneToPay: req.body.phoneToPay,
      clientPhone: req.body.clientPhone,
      parkName:req.body.parkName
    });
    const updatearrayofhistory = await User.updateOne(
      { _id: id },
      { $push: { myPayment: newPayment } },
      { new: true }
    );

    const currnetParkinUpdate = await User.findOneAndUpdate(
      { _id: id },
      { currentParking: true },
      { new: true }
    );

    const availableToParkUpdate = await Parking.findOneAndUpdate(
      { _id: req.body.parking_id },
      { availableToPark: false, whoIsParking: id },
      { new: true }
    );

    return res.status(200).json(newPayment);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updatePayment = async (req, res) => {
  const token = req.body.token;
  const id1 = jwt.verify(token, process.env.SECRET);
  id = id1._id;
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { _id: req.body.payments_id },
      { endTime: req.body.endTime },
      { new: true }
    );

    const currnetParkinUpdateb = await User.findOneAndUpdate(
      { _id: id },
      { currentParking: false },
      { new: true }
    );

    const availableToParkUpdate = await Parking.findOneAndUpdate(
      { _id: req.body.parking_id },
      { availableToPark: true, whoIsParking: null },
      { new: true }
    );

    res.status(200).json(updatePayment);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

module.exports = { fetchPayment, publishPayment, updatePayment };
