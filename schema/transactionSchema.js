import transactionModel from "../models/transactionModel.js";
import WalletModel from "../models/walletModel.js";
import { gql } from "apollo-server-express";

export const transactionTypeDefs = gql`
  type transaction {
    sellerAddress: String
    buyerAddress: String
    plateformWalletAddress: String
    plateformCuts: Float
    nftAmount: Float
    currentTime: String
  }

  type Query {
    transactions: [transaction]
  }

  type Mutation {
    setTransactionData(
      sellerAddress: String
      buyerAddress: String
      plateformWalletAddress: String
      plateformCuts: Float
      nftAmount: Float
      currentTime: String
    ): transaction
  }
`;

export const transactionResolvers = {
  Query: {
    transactions: async () => {
      const data = await transactionModel.find();
      return data;
    },
  },

  Mutation: {
    setTransactionData: (req, args) => {
      const transaction = new transactionModel({
        sellerAddress: args.sellerAddress,
        buyerAddress: args.buyerAddress,
        plateformWalletAddress: args.plateformWalletAddress,
        plateformCuts: args.plateformCuts,
        nftAmount: args.nftAmount,
      });
      transaction.save();
      return transaction;
    },
  },
};
