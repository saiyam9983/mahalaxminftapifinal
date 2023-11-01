import CollectionModal from "../models/collections.js";

import { gql } from "apollo-server-express";

export const collectionTypeDefs = gql`
  type Collections {
    collections: String
    team: String
    athlete: String
  }

  type Mutation {
    createCollection(
      collections: String
      team: String
      athlete: String
    ): Collections

    deleteCollection(
      collections: String
      team: String
      athlete: String
    ): Collections
  }

  type Query {
    getCollection: [Collections]
    getCollections: [Collections]
    getTeam: [Collections]
    getAthlete: [Collections]
  }
`;

export const collectionResolvers = {
  Query: {
    getCollection: async (root, args) => {
      let isCollection = await CollectionModal.find(
        {},
        { collections: 1, team: 1, athlete: 1 }
      );

      return isCollection;
    },

    getCollections: async (root, args) => {
      let isCollection = await CollectionModal.aggregate([
        {
          $group: { _id: { collections: "$collections" } },
        },
      ]);
      let Collection = [];
      for (let i = 0; i < isCollection.length; i++) {
        Collection.push(isCollection[i]._id);
      }

      return Collection;
    },

    getTeam: async (root, args) => {
      let isTeam = await CollectionModal.aggregate([
        {
          $group: { _id: { team: "$team" } },
        },
      ]);
      let Team = [];
      for (let i = 0; i < isTeam.length; i++) {
        Team.push(isTeam[i]._id);
      }

      return Team;
    },
    getAthlete: async (root, args) => {
      let isAthlete = await CollectionModal.aggregate([
        {
          $group: { _id: { athlete: "$athlete" } },
        },
      ]);
      let Athlete = [];
      for (let i = 0; i < isAthlete.length; i++) {
        Athlete.push(isAthlete[i]._id);
      }

      return Athlete;
    },
  },
  Mutation: {
    createCollection: async (root, args) => {
      let isCollection = await CollectionModal.findOne({
        collections: args.collections,
        team: args.team,
        athlete: args.athlete,
      });

      if (isCollection) {
        return isCollection;
      } else {
        let collections = new CollectionModal(args);
        await collections.save();
        return collections;
      }
    },
    deleteCollection: async (root, args) => {
      let remove = await CollectionModal.deleteOne(args);
      return remove;
    },
  },
};
