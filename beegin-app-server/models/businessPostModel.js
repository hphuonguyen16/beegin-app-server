const mongoose = require("mongoose");
const PostModel = require("./postModel");
const UnitPrice = require("./unitPriceModel");

const BusinessPostschema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "deferred", "expired"],
      default: "pending",
    },
    potentialReach: {
      type: Number,
      default: 0,
    },
    actualReach: {
      type: Number,
      default: 0,
    },
    activeDate: {
      type: Date,
      required: [true, "Post must have activeDate"],
    },
    expireDate: {
      type: Date,
      required: [true, "Post must have expireDate"],
    },
    unitPrice: {
      type: Number,
    },
    targetLocation: String,
    targetAge: {
      type: [Number],
      default: [0, 999],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length == 2,
        message: () => `Age Range must have two elements`,
      },
    },
    targetGender: {
      type: String,
      enum: ["other", "male", "female"],
      default: "other",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BusinessPostschema.pre("save", async function (next) {
  if (this.activeDate && this.expireDate) {
    const start = new Date(this.activeDate);
    const end = new Date(this.expireDate);
    const timeDiff = Math.abs(end - start);
    const daysDiff = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    let type = "day";
    if (daysDiff > 30) {
      type = "month";
    }

    const unitPrice = await UnitPrice.findOne({ type: type });

    this.unitPrice = unitPrice.price;
  }

  next();
});
const BusinessPostModel = PostModel.discriminator(
  "BusinessPost",
  BusinessPostschema
);

module.exports = BusinessPostModel;
