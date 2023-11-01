import { userTypeDefs, userResolvers } from "./userSchema.js";
import { nftTypeDefs, nftResolvers } from "./nftSchema.js";
import {
  nftActivityTypeDefs,
  nftActivityResolvers,
} from "./nftActivitySchema.js";

import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { collectionResolvers, collectionTypeDefs } from "./collectionSchema.js";
import {
  transactionResolvers,
  transactionTypeDefs,
} from "./transactionSchema.js";

const types = [
  userTypeDefs,
  nftTypeDefs,
  nftActivityTypeDefs,
  collectionTypeDefs,
  transactionTypeDefs,
];
const resolver = [
  userResolvers,
  nftResolvers,
  nftActivityResolvers,
  collectionResolvers,
  transactionResolvers,
];

export const typeDefs = mergeTypeDefs(types);
export const resolvers = mergeResolvers(resolver);
