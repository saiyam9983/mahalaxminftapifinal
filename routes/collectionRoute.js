import express from "express";
const router = express();

import CollectionModal from "../models/collections.js";

router.post("/create", async (req, res) => {
  let collections = new CollectionModal(args);
  await collections.save();

  return collections;
});

router.get("/collection", async (req, res) => {
  let collection = await CollectionModal.aggregate([
    {
      $group: { _id: { collection: "$collections" } },
    },
  ]);
  return res.json(collection);
});

router.get("/teams", async (req, res) => {
  let team = await CollectionModal.aggregate([
    {
      $match: {
        collections: req.body.collection,
      },
    },
    {
      $group: { _id: { team: "$team" } },
    },
  ]);
  return res.json(team);
});

router.get("/athlete", async (req, res) => {
  let team = await CollectionModal.aggregate([
    {
      $match: {
        team: req.body.team,
      },
    },
    {
      $group: { _id: { athlete: "$athlete" } },
    },
  ]);

  return res.json(team);
});

router.get("/all", async (req, res) => {
  let collections = await getCollectionInfo();
  var category = [];
  for (let i = 0; i < collections.length; i++) {
    let collection = collections[i];
    var data = {};
    var Teams = [];
    data.code = collection?._id?.collection;
    data.name = collection?._id?.collection;
    let teamsInfo = await getTeamInfo(collection?._id?.collection);
    for (let i = 0; i < teamsInfo.length; i++) {
      var team = {};
      let teamInfo = teamsInfo[i];
      var athletes = [];
      var athlete = await getAthleteInfo(teamInfo?._id?.team);
      team.code = teamInfo?._id?.team;
      team.name = teamInfo?._id?.team;
      for (let i = 0; i < athlete.length; i++) {
        let ath = {};
        let athleteInfo = athlete[i];
        ath.code = athleteInfo?._id?.athlete;
        ath.name = athleteInfo?._id?.athlete;
        athletes.push(ath);
      }
      console.log(athletes);
      team.items = athletes;
      Teams.push(team);
    }

    data.items = Teams;
    category.push(data);
  }
  return res.json(category);
});

async function getTeamInfo(collection) {
  return await CollectionModal.aggregate([
    {
      $match: {
        collections: collection,
      },
    },
    {
      $group: { _id: { team: "$team" } },
    },
  ]);
}
async function getAthleteInfo(team) {
  return await CollectionModal.aggregate([
    {
      $match: {
        team: team,
      },
    },
    {
      $group: { _id: { athlete: "$athlete" } },
    },
  ]);
}
async function getCollectionInfo() {
  return await CollectionModal.aggregate([
    {
      $group: { _id: { collection: "$collections" } },
    },
  ]);
}

export default router;
