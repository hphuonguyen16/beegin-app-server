const mongoose = require("mongoose");

const Profileschema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please tell us your first name!"],
    },
    lastname: {
      type: String,
      required: [true, "Please tell us your last name!"],
    },
    slug: {
      type: String,
      required: [true, "Please tell us your slug!"],
      unique: true,
      // validate: {
      //   validator: function (value) {
      //     // Check if the slug starts with '@' and has no spaces
      //     return /^@[^ ]*$/.test(value);
      //   },
      //   message:
      //     "Invalid slug format. It should start with '@' and have no spaces.",
      // },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Profileschema.index({ user: 1 }, { unique: true });
Profileschema.post("save", async function () {
  await this.populate("user");
});

const ProfileModel = mongoose.model("Profile", Profileschema);

module.exports = ProfileModel;
