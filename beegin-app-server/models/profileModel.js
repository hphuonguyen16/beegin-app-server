import mongoose, { Schema, InferSchemaType } from 'mongoose';

const Profileschema = new Schema({
  firstname: {
    type: String,
    required: [true, 'Please tell us your first name!'],
  },
  lastname: {
    type: String,
    required: [true, 'Please tell us your last name!'],
  },
  gender: {
    type: Boolean,
    required: [true, 'Please tell us your gender'],
  },
  avatar: String,
  address: String,
  bio: String,
  birthday: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
});

const ProfileModel = mongoose.model('Profile', Profileschema);

module.exports = ProfileModel;
