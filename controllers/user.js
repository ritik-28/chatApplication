const User = require("../model/user");
const strVal = require("../util/strValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signupPost = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (strVal(name) || strVal(email) || strVal(phone) || strVal(password)) {
      return res.status(400).json({ err: "please fill all the details" });
    } else {
      const emailPresent = await User.findOne({
        attribute: [email],
        where: { email },
      });
      if (emailPresent != null) {
        return res.status(409).json("email is already present");
      }
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          throw new Error("password encryption error");
        }
        await User.create({
          name,
          email,
          phone,
          password: hash,
        });
        res
          .status(201)
          .json({ msg: "new user created successfully", success: true });
      });
    }
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

function generateToken(id) {
  return jwt.sign({ userId: id }, process.env.TOKEN_SECRET);
}

const signinPost = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (strVal(email) || strVal(password)) {
      return res.status(400).json({ err: "Please fill all the details" });
    } else {
      const emailExist = await User.findOne({
        where: { email },
      });
      if (emailExist != null) {
        bcrypt.compare(password, emailExist.password, (err, result) => {
          if (err) {
            return res.status(500).json("something went wrong");
          } else if (result === true) {
            return res.json(generateToken(emailExist.id));
          } else {
            return res.status(401).json("User is not authorized");
          }
        });
      } else {
        return res.status(404).json("user not found");
      }
    }
  } catch (err) {
    return res.status(403).json({ err: err });
  }
};

module.exports = { signupPost, signinPost };
