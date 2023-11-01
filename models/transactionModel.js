import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    sellerAddress: {
      type: String,
    },
    buyerAddress: {
      type: String,
    },
    plateformWalletAddress: {
      type: String,
      required: true,
    },
    plateformCuts: {
      type: Number,
      required: true,
    },
    nftAmount: {
      type: Number,
      require: true,
    },

    currentTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("transaction", transactionSchema);
