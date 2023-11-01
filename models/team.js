import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
  name: String,
  slug: String,
  //   athlete: [
  //     {
  //       name: { type: String },
  //       slug: { type: String },
  //     },
  //   ],
});

export default mongoose.model("Team", teamSchema);
