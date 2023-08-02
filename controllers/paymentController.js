const Payment = require("../models/payment");
const User = require("../models/user");
const Parking = require("../models/parking");
const jwt = require("jsonwebtoken");
const io = require('socket.io-client');

function timeDifferenceInHours(dateStr, price) {
  // Convert the input date string to a Date object
  const inputDate = new Date(dateStr);

  // Get the current date and time
  const now = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceInMilliseconds = now - inputDate;

  // Convert the time difference to hours and round to 2 digits after the decimal point
  const hoursDifference = timeDifferenceInMilliseconds / (1000 * 60 * 60);
  const roundedHoursDifference = parseFloat(hoursDifference.toFixed(2));

  const totalPrice = roundedHoursDifference * price

  return totalPrice;
}

const fetchPayment = async (req, res) => {
  try {
    const allPayment = await Payment.find({});
    res.status(200).json(allPayment);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const getLastPayment = async (req, res) => {
  try {
    const token = req.body.token;
    const id1 = jwt.verify(token, process.env.SECRET);
    let id = id1._id;
    const allPaymentOfUser = await User.findById({ _id: id }).populate("myPayment");
    const lastPayment = allPaymentOfUser.myPayment[allPaymentOfUser.myPayment.length - 1]
    res.status(200).json(lastPayment)
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};


const socket = io('http://localhost:3000')
socket.on("connect", () => { console.log('connected'); })

const publishPayment = async (req, res) => {
  try {
    const token = req.body.token;
    const id1 = jwt.verify(token, process.env.SECRET);
    const date = new Date()
    const id = id1._id;
    console.log(id);
    const newPayment = await Payment.create({
      parkingId: req.body.parkingId,
      parkName: req.body.parkName,
      startTime: req.body.startTime,
      endTime: null,
      pricePerHour: req.body.pricePerHour,
      parkingLocation: req.body.parkingLocation,
      phoneToPay: req.body.phoneToPay,
      clientPhone: req.body.clientPhone,
      finalPrice: req.body.finalPrice,
      date: date

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

    socket.emit('paymentPublished', newPayment);
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
    const paymentsOfUser = await User.findOne({ _id: id }).populate("myPayment")
    console.log("blabla", paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1], "from here")
    const parkingID = paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1].parkingId;
    const paymentID = paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1]._id


    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const endTimeAsString = `${hours}:${minutes}`;

    const updatePayment = await Payment.findOneAndUpdate(
      { _id: paymentID },
      { endTime: endTimeAsString },
      { new: true }
    );

    const updatePayment2 = await Payment.findOneAndUpdate(
      { _id: paymentID },
      { finalPrice: timeDifferenceInHours(paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1].date, Number(paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1].pricePerHour)) },
      { new: true }
    );

    const currnetParkinUpdateb = await User.findOneAndUpdate(
      { _id: id },
      { currentParking: false },
      { new: true }
    );

    const availableToParkUpdate = await Parking.findOneAndUpdate(
      { _id: parkingID },
      { availableToPark: true, whoIsParking: null },
      { new: true }
    );
    socket.emit('updatepark', paymentID,parkingID);
    res.status(200).json(paymentID);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};




module.exports = { fetchPayment, publishPayment, updatePayment, getLastPayment };
