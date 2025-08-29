import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },

});


const Model = mongoose.model("User", productSchema);

export default Model;
