import mongoose, { Schema, InferSchemaType } from "mongoose";

const HashtagSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a Hashtag name"],
  },
});

const HashtagModel = mongoose.model("Hashtag", HashtagSchema);

module.exports = HashtagModel;
