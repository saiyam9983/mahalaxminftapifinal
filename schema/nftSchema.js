import NftModel from "../models/nftModel.js";
import { gql } from "apollo-server-express";
import Web3 from "web3";
import { ChainsInfo } from "../smart-config/config-chains.js";

export const nftTypeDefs = gql`
  type Bid {
    bidderAddress: String
    amount: Float
    timestamp: String
    listingId: String
  }
  type Nft {
    _id: ID
    name: String
    tokenId: String
    url: String
    chainId: Int
    network: String
    duration: String
    listingId: String
    description: String
    category: String
    nftStatus: String
    collectionAddress: String
    creatorAddress: String
    ownerAddress: String
    auctionFinalPrice: Float
    imageUrl: String
    collections: String
    teams: String
    athlete: String
    musician: String
    artist: String
    isMarketPlace: Boolean
    isAuction: Boolean
    price: Float
    supply: Int
    mintedNft: Int
    availableSupply: Int
    isApproved: Boolean
    bids: [Bid]
  }
  type Query {
    nfts: [Nft]
    filterNfts(
      collections: String
      team: String
      athlete: String
      musician: String
      artist: String
      network: String
      nftStatus: String
      page: Int
    ): [Nft]
    getNFTbyObjectId(nftId: String): [Nft]
    auctionNfts: [Nft]
    auctionFilterNft: [Nft]
    getBidsByNftId(nftId: ID!): [Bid]
    getNftsOfUser(creatorAddress: String): [Nft]
    getNftsOfOwner(ownerAddress: String): [Nft]
    getSingleNft(
      tokenId: String
      collectionAddress: String
      network: String
    ): [Nft]
    searchNfts(key: String): [Nft]
    getSingleNftById(id: String): [Nft]
  }
  type Mutation {
    createNft(
      name: String
      tokenId: String
      url: String
      imageUrl: String
      chainId: Int
      network: String
      nftStatus: String
      listingId: String
      description: String
      category: String
      isAuction: Boolean
      collectionAddress: String
      creatorAddress: String
      ownerAddress: String
      collections: String
      teams: String
      athlete: String
      musician: String
      artist: String
      supply: Int
      availableSupply: Int
      mintedNft: Int
      price: Float
      isMarketPlace: Boolean
    ): Nft
    putOnSale(
      collectionAddress: String
      tokenId: String
      isMarketPlace: Boolean
      nftStatus: String
      price: Float
      ownerAddress: String
    ): Nft

    lazyMintUpdate(
      _id: String
      tokenId: String
      isMarketPlace: Boolean
      nftStatus: String
      price: Float
      auctionFinalPrice: Float
      duration: String
      isAuction: Boolean
      ownerAddress: String
      category: String
      listingId: String
    ): Nft

    mintedNftUpdate(nftId: String, mintedNft: Int, availableSupply: Int): Nft
    deleteNft(id: String!): Nft
    updateNftApprove(_id: String!, isApproved: Boolean): Nft

    addBidToNft(nftId: ID, bidderAddress: String, amount: Float): Nft
  }

  mutation Mutation(
    $id: String
    $tokenId: String
    $isMarketPlace: Boolean
    $nftStatus: String
    $price: Float
    $ownerAddress: String
    $category: String
    $listingId: String
  ) {
    lazyMintUpdate(
      _id: $id
      tokenId: $tokenId
      isMarketPlace: $isMarketPlace
      nftStatus: $nftStatus
      price: $price
      ownerAddress: $ownerAddress
      category: $category
      listingId: $listingId
    ) {
      _id
      name
      tokenId
      url
      chainId
      network
      listingId
      category
      nftStatus
      collectionAddress
      creatorAddress
      ownerAddress
      imageUrl
      collections
      teams
      athlete
      musician
      artist
      isMarketPlace
      price
    }
  }
  mutation deleteNft($id: String!) {
    nftDelete(_id: $id) {
      _id
      name
      tokenId
      url
      chainId
      network
    }
  }
  mutation addBidToNft($nftId: ID!, $bidderAddress: String!, $amount: Float!) {
    addBidToNft(nftId: $nftId, bidderAddress: $bidderAddress, amount: $amount) {
      _id
      name
      tokenId
      url

      bids {
        bidderAddress
        amount
        timestamp
      }
    }
  }
  mutation mintedNftUpdate(
    $nftId: String
    $mintedNft: Int
    $availableSupply: Int
  ) {
    mintedNftUpdate(
      nftId: $nftId
      mintedNft: $mintedNft
      availableSupply: $availableSupply
    ) {
      _id
      name
      tokenId
      url
      chainId
      network
      listingId
      category
      nftStatus
      collectionAddress
      creatorAddress
      ownerAddress
      imageUrl
      collections
      teams
      athlete
      musician
      artist
      isMarketPlace
      price
      supply
      mintedNft
      availableSupply
    }
  }
`;

export const nftResolvers = {
  Query: {
    nfts: async () => {
      const data = await NftModel.find();
      console.log(data);
      return data;
    },
    getBidsByNftId: async (root, args) => {
      const { nftId } = args;

      try {
        const nft = await c.findById(nftId);

        if (!nft) {
          throw new Error("NFT not found");
        }

        // Return the bids associated with the NFT
        return nft.bids;
      } catch (error) {
        throw new Error(`Failed to fetch bids: ${error.message}`);
      }
    },
    auctionNfts: async () => {
      const data = await NftModel.find({ isAuction: true });
      return data;
    },
    filterNfts: async (root, args) => {
      const collections = args.collections;
      const team = args.team;
      const athlete = args.athlete;
      const musician = args.musician;
      const artist = args.artist;
      const network = args.network;
      const nftStatus = args.nftStatus;
      const page = args.page;
      const filters = {};
      collections !== ""
        ? (filters.collections = collections.toLowerCase())
        : null;
      team !== "" ? (filters.teams = team.toLowerCase()) : null;
      athlete !== "" ? (filters.athlete = athlete.toLowerCase()) : null;
      musician !== "" ? (filters.musician = musician.toLowerCase()) : null;
      artist !== "" ? (filters.artist = artist.toLowerCase()) : null;
      network !== "" ? (filters.network = network.toLowerCase()) : null;
      nftStatus !== "" ? (filters.nftStatus = nftStatus.toLowerCase()) : null;
      // page = 0;
      // filters.isMarketPlace = true;

      let data;
      await NftModel.aggregate([
        {
          $match: filters,
        },
        {
          $sort: { updatedAt: -1 },
        },
        {
          $skip: page * 8,
        },
        {
          $limit: 8,
        },
      ])
        .then((res) => {
          data = res;
        })
        .catch((err) => {
          console.log(err);
        });
      return data;
    },
    getNFTbyObjectId: async (root, args) => {
      const nfts = await NftModel.find({ _id: args.nftId });
      return nfts;
    },
    getNftsOfOwner: async (root, args) => {
      const nfts = await NftModel.find({ ownerAddress: args.ownerAddress });
      return nfts;
    },
    getSingleNftById: async (root, args) => {
      const nfts = await NftModel.find({ _id: args.id }, {});
      return nfts;
    },
    searchNfts: async (root, args) => {
      const key = args.key;
      const nfts = await NftModel.find({
        name: { $regex: key, $options: "i" },
      });
      return nfts;
    },
    getNftsOfUser: async (root, args) => {
      const nfts = await NftModel.find({ creatorAddress: args.creatorAddress });
      return nfts;
    },
    getSingleNft: async (root, args) => {
      let nft = await NftModel.find({
        tokenId: args.tokenId,
        collectionAddress: args.collectionAddress,
        network: args.network,
      });
      return nft;
    },
  },

  Mutation: {
    addBidToNft: async (root, args) => {
      const { nftId, bidderAddress, amount } = args;

      try {
        const nft = await NftModel.findById(nftId);

        if (!nft) {
          throw new Error("NFT not found");
        }

        // Create a new bid object
        const newBid = {
          bidderAddress,
          amount,
          timestamp: new Date().toISOString(), // Set the current timestamp
        };

        // Add the new bid to the NFT's bids array
        nft.bids.push(newBid);

        // Save the updated NFT with the new bid
        await nft.save();

        return nft;
      } catch (error) {
        throw new Error(`Failed to add bid: ${error.message}`);
      }
    },

    createNft: async (root, args) => {
      let nft = new NftModel({
        name: args.name,
        tokenId: args.tokenId,
        url: args.url,
        imageUrl: args.imageUrl,
        creatorAddress: args.creatorAddress,
        chainId: args.chainId,
        network: args.network,
        listingId: args.listingId,
        description: args.description,
        category: args.category,
        isAuction: args.isAuction,
        nftStatus: args.nftStatus,
        ownerAddress: args.ownerAddress,
        collectionAddress: args.collectionAddress,
        collections: args.collections,
        teams: args.teams,
        athlete: args.athlete,
        musician: args.musician,
        artist: args.artist,
        supply: args.supply,
        mintedNft: args.mintedNft,
        availableSupply: args.availableSupply,
        price: args.price,
        isMarketPlace: args.isMarketPlace,
      });
      await nft.save();
      return nft;
    },

    putOnSale: async (root, args) => {
      let nft = NftModel.findOneAndUpdate(
        { tokenId: args.tokenId, collectionAddress: args.collectionAddress },
        {
          isMarketPlace: args.isMarketPlace,
          price: args.price,
          nftStatus: args.nftStatus,
          ownerAddress: args.ownerAddress,
        }
      );
      return nft;
    },

    lazyMintUpdate: async (root, args) => {
      let nft = NftModel.findByIdAndUpdate(
        { _id: args._id },
        {
          tokenId: args.tokenId,
          isMarketPlace: args.isMarketPlace,
          nftStatus: args.nftStatus,
          price: args.price,
          ownerAddress: args.ownerAddress,
          auctionFinalPrice: args.auctionFinalPrice,
          category: args.category,
          duration: args.duration,
          listingId: args.listingId,
          isAuction: args.isAuction,
        },
        { new: true }
      );
      return nft;
    },

    mintedNftUpdate: async (root, args) => {
      let nft = NftModel.findByIdAndUpdate(
        { _id: args.nftId },
        { $set: args },
        { new: true }
      );

      return nft;
    },

    deleteNft: async (root, args) => {
      let nft = NftModel.findByIdAndDelete(args.id, {});
      return nft;
    },

    updateNftApprove: async (root, args) => {
      let nft = NftModel.findByIdAndUpdate(
        { _id: args._id },
        {
          isApproved: args.isApproved,
        },
        { new: true }
      );
      return nft;
    },
  },
};
