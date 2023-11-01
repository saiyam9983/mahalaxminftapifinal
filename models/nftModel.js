import mongoose from "mongoose";

const nftSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tokenId: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    chainId: {
      type: Number,
      required: true,
    },
    network: {
      type: String,
      required: true,
    },
    nftStatus: {
      type: String,
      required: true,
    },
    supply: {
      type: Number,
      default: 1,
    },
    mintedNft: {
      type: Number,
      default: 0,
    },
    availableSupply: {
      type: Number,
      default: 0,
    },
    listingId: {
      type: String,
    },
    category: {
      type: String,
    },
    collectionAddress: {
      type: String,
      required: true,
    },
    creatorAddress: {
      type: String,
    },
    ownerAddress: {
      type: String,
    },
    collections: {
      type: String,
      default: "",
    },
    teams: {
      type: String,
      default: "",
    },
    athlete: {
      type: String,
      default: "",
    },
    musician: {
      type: String,
      default: "",
    },
    artist: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      default: "",
    },
    isMarketPlace: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    auctionFinalPrice: {
      type: Number,
      default: 0,
    },
    isAuction: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      default: "",
    },
    bids: [
      {
        bidderAddress: {
          type: String,
          required: false,
        },
        listingId: {
          type: String,
          required: false,
        },
        amount: {
          type: Number,
          required: false,
        },
        description: {
          type: String,
          required: false,
          default: "",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Nft", nftSchema);
