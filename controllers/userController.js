
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltround = 10;
hashedPassword = "";

const fetchUser = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const findUserById = async (req, res) => {
  try {
    const oneUser = await User.findById({_id: req.body._id});
    res.status(200).json(oneUser);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const publishUser = async (req, res) => {
  console.log(req.body);
  try {
    const UserExists = await User.findOne({ _id: req.body._id });
    if (UserExists) {
      return res.status(400).json("User already exists!");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltround);
    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      licensePlates: req.body.licensePlates,
      currentParking: false,
      totalEarn: 0
    });

    const userExists = await User.findOne({ username: req.body.username });
    if (!userExists) {
      return res.status(400).json('wrong credentials')
    }
    const isMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (isMatch == true) {
      const token = jwt.sign({ _id: userExists._id }, process.env.SECRET, { expiresIn: "24h" });
      return res.status(200).json(token);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const loginFunc = async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (!userExists) {
      return res.status(400).json('wrong credentials')
    }
    const isMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (isMatch == true) {
      const token = jwt.sign({ _id: userExists._id }, process.env.SECRET, { expiresIn: "96h" });
      return res.status(200).json(token);
    } else {
      return res.status(400).json("wrong username/password");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.body._id });
    res.status(200).send("user was delete");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateUser = async (req, res) => {
  console.log("get into func")
  try {
    
    console.log(req.body.licenses, "req.body.backend");
    const updateUser = await User.findByIdAndUpdate(req.body._id, {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      licenses:req.body.licenses
      // licensePlates: req.body.licensePlates,
    },
      { new: true });
    console.log(updateUser);
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


const translateToken = async (req, res) => {
  try {
    const token = req.body.token
    console.log(token);
    const username = jwt.verify(token, process.env.SECRET)
    console.log(username);

    const UserData = await User.findOne({ _id:username._id })
    .populate("myParking")
    .populate("myPayment")
    return res.status(200).json(UserData)
  }
  catch (err) {
    return res.status(500).json(err.message)
  }
}

const findUserExists = async (req, res) => {
  try {
    const OneUser = await User.findOne({username:req.body.username});
    console.log(OneUser)

    res.status(200).json(OneUser);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
};

const loginFuncFromVerify = async (req, res) => {
 try {
    const userExists = await User.findOne({ username: req.body.username });
    const token = jwt.sign({ _id: userExists._id }, process.env.SECRET, { expiresIn: "96h" });
    return res.status(200).json(token);
  }catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
}

const changePassword = async (req, res) => {
  try {
    const token = req.body.token
    console.log(token);
    const username = jwt.verify(token, process.env.SECRET)
    console.log(username);

    const hashedPasswordforupdate = await bcrypt.hash(req.body.password,saltround);

    const UserData = await User.findByIdAndUpdate(username._id ,{password: hashedPasswordforupdate},{new:true})

    return res.status(200).json(UserData)
  }
  catch (err) {
    return res.status(500).json(err.message)
  }
};

const loginFuncFromToken = async (req, res) => {
  try {
    const token = req.body.token
    console.log(token);
    const username = jwt.verify(token, process.env.SECRET)
    console.log(username);

    const UserData = await User.findOne({ _id:username._id })
    return res.status(200).json(UserData)
  }
  catch (err) {
    return res.status(500).json(err.message)
  }
}
  


module.exports = { fetchUser, publishUser, deleteUser, updateUser, loginFunc, loginFuncFromVerify, translateToken, findUserById, findUserExists, changePassword, loginFuncFromToken };
