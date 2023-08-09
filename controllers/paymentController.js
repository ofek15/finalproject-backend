const Payment = require("../models/payment");
const User = require("../models/user");
const Parking = require("../models/parking");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

function timeDifferenceInHours(dateStr, price) {
  // Convert the input date string to a Date object
  const inputDate = new Date(dateStr);

  // Get the current date and time
  // const now = new Date();
  let now = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceInMilliseconds = now - inputDate;

  // Convert the time difference to hours and round to 2 digits after the decimal point
  const hoursDifference = timeDifferenceInMilliseconds / (1000 * 60 * 60);
  const roundedHoursDifference = parseFloat(hoursDifference.toFixed(2));

  const totalPrice = roundedHoursDifference * price;

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
    const allPaymentOfUser = await User.findById({ _id: id }).populate(
      "myPayment"
    );
    const lastPayment =
      allPaymentOfUser.myPayment[allPaymentOfUser.myPayment.length - 1];
    res.status(200).json(lastPayment);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const publishPayment = async (req, res) => {
  try {
    const token = req.body.token;
    const id1 = jwt.verify(token, process.env.SECRET);
    const date = new Date();
    const id = id1._id;
    console.log(id);
    const available = await Parking.findById({ _id: req.body.parkingId });
    if (!available.availableToPark) {
      return res.status(404).json("Oops, Someone was faster then you");
    }
    const newPayment = await Payment.create({
      parkingId: req.body.parkingId,
      ownerParkingId: req.body.ownerParkingId,
      parkName: req.body.parkName,
      startTime: req.body.startTime,
      endTime: null,
      pricePerHour: req.body.pricePerHour,
      parkingLocation: req.body.parkingLocation,
      phoneToPay: req.body.phoneToPay,
      clientPhone: req.body.clientPhone,
      clientName: req.body.clientName,
      finalPrice: req.body.finalPrice,
      date: date,
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
      { _id: req.body.parkingId },
      {
        availableToPark: false,
        whoIsParking: id,
        currentLicense: currnetParkinUpdate.activeLicense,
      },
      { new: true }
    );
    return res.status(200).json(newPayment);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const updatePayment = async (req, res) => {
  const token = req.body.token;
  const id1 = jwt.verify(token, process.env.SECRET);
  id = id1._id;
  try {
    const paymentsOfUser = await User.findOne({ _id: id }).populate(
      "myPayment"
    );
    console.log(
      "blabla",
      paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1],
      "from here"
    );
    const parkingID =
      paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1].parkingId;
    const paymentID =
      paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1]._id;
    const now = new Date();
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const endTimeAsString = now.toLocaleTimeString(undefined, options);
    const updatePayment = await Payment.findOneAndUpdate(
      { _id: paymentID },
      { endTime: endTimeAsString },
      { new: true }
    );

    const updatePayment2 = await Payment.findOneAndUpdate(
      { _id: paymentID },
      {
        finalPrice: timeDifferenceInHours(
          paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1].date,
          Number(
            paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1]
              .pricePerHour
          )
        ),
      },
      { new: true }
    );

    const currnetParkinUpdateb = await User.findOneAndUpdate(
      { _id: id },
      { currentParking: false },
      { new: true }
    );

    const availableToParkUpdateb = await Parking.findOneAndUpdate(
      { _id: parkingID },
      { availableToPark: true, whoIsParking: null, currentLicense: null },
      { new: true }
    );
    //////////////////////////////////// update total earn
    const ownerParkingId =
      paymentsOfUser.myPayment[paymentsOfUser.myPayment.length - 1]
        .ownerParkingId;
    const currnetParkinUpdate = await User.findOneAndUpdate(
      { _id: ownerParkingId },
      { $inc: { totalEarn: updatePayment2.finalPrice } },
      { new: true }
    );
    /////////////////////////////////////////////////////
    res.status(200).json(paymentID);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const avgPerHour = async (req, res) => {
  try {
    const allParking = await Parking.find({});
    if (allParking.length === 0) {
      return 0;
    }

    let totalSum = 0;
    allParking.forEach((obj) => {
      totalSum += Number(obj.pricePerHour);
    });
    const average = totalSum / allParking.length;
    res.status(200).json(parseFloat(average.toFixed(2)));
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

module.exports = {
  fetchPayment,
  publishPayment,
  updatePayment,
  getLastPayment,
  avgPerHour,
};
