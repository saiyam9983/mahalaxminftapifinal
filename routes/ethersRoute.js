import express from "express";

const router = express();
import { ThirdwebStorage } from "@thirdweb-dev/storage";

const storage = new ThirdwebStorage();
import Web3 from "web3";

const FROM_ADDRESS = "0xc73b17179bf0c59cd5860bb25247d1d1092c1088";
const CONTRACT_ADDRESS = "0xbd5fb504d4482ef4366dfa0c0edfb85ed50a9bbb";
const web3_ = new Web3(
  "https://mainnet.infura.io/v3/9c48d1f781404552b1a017d597f6bee1"
);

router.get("/", async (req, res) => {
  const data = await storage.downloadJSON(
    "ipfs://QmctumRBxMbYnpwojvk7dEAx6u2tpLdHd9kvhxbbb9iQ5N/0"
  );
  return res.send(data);
});

export default router;
