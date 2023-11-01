import mongoose from "mongoose";

const collectionsSchema = mongoose.Schema({
  collections: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  team: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  athlete: { type: String, required: true, lowercase: true, trim: true },
});

export default mongoose.model("Collection", collectionsSchema);
