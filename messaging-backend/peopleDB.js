import mongoose from "mongoose";

const peopleSchema = mongoose.Schema({
  userEmail: String,
  convo: Array
});

export default mongoose.model("people", peopleSchema);
