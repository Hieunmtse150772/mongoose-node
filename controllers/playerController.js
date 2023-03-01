const createError = require('http-errors');
const mongoose = require('mongoose');

const Players = require('../Models/players');
let clubData = [
  { "id": "1", "name": "Arsenal" },
  { "id": "2", "name": "Manchester United" },
  { "id": "3", "name": "Chelsea" },
  { "id": "4", "name": "Manchester City" },
  { "id": "5", "name": "PSG" },
  { "id": "6", "name": "Inter Milan" },
  { "id": "7", "name": "Real Madrid" },
  { "id": "8", "name": "Barcelona" },
  { "id": "9", "name": "AC milan" }
]
const positions = [
  {
    id: 1,
    name: "Foward",
  },
  {
    id: 2,
    name: "Midfiedler",
  },
  {
    id: 3,
    name: "Defender",
  },
  {
    id: 4,
    name: "Goalkeeper",
  },
];
module.exports = {
  getAllPlayers: async (req, res, next) => {
    try {
      const results = await Players.find({}, { __v: 0 }).then((players) => {
        res.render('player', {
          title: 'the list players',
          players: players,
          clubList: clubData,
          positionList: positions
        });
      }).catch(next);
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewPlayers: async (req, res, next) => {
    try {
      const player = new Players(req.body);
      const result = await player.save().then(() => {
        res.redirect('/players')
      });
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findPlayerById: async (req, res, next) => {
    const id = req.params.id;
    try {
      //   const nation = await Nation.findById(id);
      const player = await Players.findOne({ _id: id });
      if (!player) {
        throw createError(404, 'Player does not exist.');
      }
      res.send(player);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Player id'));
        return;
      }
      next(error);
    }
  },
  formEditPlayer: async (req, res, next) => {
    const id = req.params.id;
    try {
      //   const nation = await Nation.findById(id);
      const player = await Players.findOne({ _id: id }).then((player) => {
        res.render('editPlayer', {
          title: 'edit Player',
          player: player,
          clubList: clubData,
          positionList: positions
        })
      });
      if (!player) {
        throw createError(404, 'Player does not exist.');
      }
      res.send(player);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Player id'));
        return;
      }
      next(error);
    }
  },
  updatePlayer: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      console.log("aaaaaaa")
      const result = await Players.findByIdAndUpdate(id, updates, options).then(() => {
        res.redirect('/players')
      });
      if (!result) {
        throw createError(404, 'Player does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Player Id'));
      }

      next(error);
    }
  },

  deleteAPlayer: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Players.findByIdAndDelete(id).then(() => {
        res.redirect("/players");
      });
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Player id'));
        return;
      }
      next(error);
    }
  }
};