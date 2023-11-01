import NftModel from "../models/nftModel.js";
import UserModel from "../models/userModel.js";
import WalletModel from "../models/walletModel.js";
import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    _id: ID
    displayName: String
    username: String
    avatar_url: String
    about_details: String
    bg_image: String
    firstName: String
    lastName: String
    email: String
    currency: String
    phone: String
    location: String
    wallets: [Wallet]
  }

  type Wallet {
    _id: ID
    address: String
    isPrimary: Boolean
    user: User
  }

  type Query {
    users: [User]
    user(walletAddress: String): Wallet
    wallets: [Wallet]
    wallet(address: String): Wallet
    getUserByNft(
      collectionAddress: String
      tokenId: String
      network: String
    ): User

    signIn(walletAddress: String): Wallet
  }

  type Mutation {
    signUp(
      displayName: String
      username: String
      about_details: String
      firstName: String
      lastName: String
      email: String
      walletAddress: String
    ): User
    linkWallet(walletAddress: String, userId: String): Wallet
    updateUser(
      userId: String
      displayName: String
      username: String
      avatar_url: String
      about_details: String
      bg_image: String
      firstName: String
      lastName: String
      email: String
      phone: String
    ): User

    updateUserBadge(phone: String, userId: String, location: String): User
  }
`;

export const userResolvers = {
  Query: {
    users: async () => {
      const data = await UserModel.find().populate("wallets");
      return data;
    },

    user: async (root, args) => {
      //const data = await WalletModel.findOne({wallets: {$in: [args.walletAddress]}})
      const data = await WalletModel.findOne({
        address: args.walletAddress,
      }).populate("user");
      console.log(data);
      return data;
    },
    getUserByNft: async (root, args) => {
      const { collectionAddress, tokenId, network } = args;

      try {
        // Find the NFT based on the provided parameters
        const nft = await NftModel.findOne({
          collectionAddress,
          tokenId,
          network,
        });
        console.log(nft);
        if (!nft) {
          throw new Error("NFT not found");
        }

        // Find the wallet associated with the NFT
        const wallet = await WalletModel.findOne({
          address: nft.creatorAddress,
        });

        if (!wallet) {
          throw new Error("Wallet not found");
        }

        // Use populate to fetch the associated user
        const userWithWallet = await UserModel.findOne({
          _id: wallet.user,
        }).populate("wallets");

        if (!userWithWallet) {
          throw new Error("User with wallets not found");
        }

        // Return the user with associated wallet(s)
        return userWithWallet;
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },

    wallets: async () => {
      const data = await WalletModel.find();
      return data;
    },

    wallet: async (root, args) => {
      const data = await WalletModel.findOne({ address: args.address });
      return data;
    },

    signIn: async (root, args) => {
      const data = await WalletModel.findOne({
        address: args.walletAddress,
      }).populate();
      return data;
    },
  },

  Mutation: {
    signUp: async (root, args) => {
      const user = new UserModel({
        displayName: args.displayName,
        username: args.username,  
        avatar_url: args.avatar_url,
        about_details: args.about_details,
        bg_image: args.bg_image,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        phone: args.phone,
        wallets: [],
      });
      const existingWallet = await WalletModel.findOne({
        address: args.walletAddress,
      });
      const wallet = new WalletModel({
        address: args.walletAddress,
        isPrimary: true,
      });
      user.wallets.push(wallet);
      if (existingWallet) {
        throw new Error("Wallet Already exists");
      } else {
        user.save().then(() => {
          wallet.user = user;
          wallet.save();
        });
        return user;
      }
    },

    linkWallet: async (root, args) => {
      const existingWallet = await WalletModel.findOne({
        address: args.walletAddress,
      });
      const user = await UserModel.findById(args.userId);
      if (!user) {
        throw new Error("User does not exist");
      } else {
        if (existingWallet) {
          throw new Error("Wallet Already exists");
        } else {
          const newWallet = new WalletModel({
            address: args.walletAddress,
            isPrimary: false,
            user: user,
          });
          user.wallets.push(newWallet);
          user.save();
          newWallet.save();
          return newWallet;
        }
      }
    },

    updateUser: async (root, args) => {
      const user = UserModel.findByIdAndUpdate(
        { _id: args.userId },
        { $set: args },
        { new: true }
      );
      return user;
    },
    updateUserBadge: async (root, args) => {
      const user = await UserModel.findByIdAndUpdate(
        { _id: args.userId },
        { $set: args },
        { new: true }
      );
      return user;
    },
  },
};
