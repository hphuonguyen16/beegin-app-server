import mongoose, { Schema, InferSchemaType } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
