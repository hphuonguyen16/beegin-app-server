const mongoose = require("mongoose");

const Profileschema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please tell us your first name!"],
  },
  lastname: {
    type: String,
    required: [true, "Please tell us your last name!"],
  },
  gender: {
    type: Boolean,
    required: [true, "Please tell us your gender"],
  },
  avatar: String,
  background: String,
  address: String,
  bio: String,
  birthday: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
});

Profileschema.post("save", async function () {
  await this.populate('user');
});

const ProfileModel = mongoose.model("Profile", Profileschema);

module.exports = ProfileModel;
