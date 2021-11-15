import mongoose from "mongoose";

const convoSchema = mongoose.Schema({
  name: String,
  mess: {
    who: String,
    what: String,
    when: String
  }
});

export default mongoose.model("convos", convoSchema);
