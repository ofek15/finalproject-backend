const express = require("express");
const app = express();
const PORT = 5000;
const userRoutes = require("./routes/userRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mongoose = require("mongoose");
const cors = require('cors')
require('dotenv').config();

mongoose
  .connect(
    "mongodb+srv://cheneylon1:Chen2001@cluster.5sa3ga8.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Successfully connected to mongodb!"))
  .catch((err) => console.log(err.message));

  app.use(cors())

app.get("/", (req, res) => {
  res.json({ name: "ofek" });
});

app.use(express.json());
app.use("/user", userRoutes);
app.use("/parking", parkingRoutes )
app.use("/payment", paymentRoutes )

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
