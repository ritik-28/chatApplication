const User = require("../model/user");
const strVal = require("../util/strValidator");
const bcrypt = require("bcrypt");

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

module.exports = { signupPost };
