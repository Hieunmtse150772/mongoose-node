const createError = require('http-errors');
const mongoose = require('mongoose');

const Nations = require('../Models/nations');

module.exports = {
  getAllNations: async (req, res, next) => {
    try {
      const results = await Nations.find({}, { __v: 0 }).then((nations)=>{
        res.render('nations', {
          title: 'the list nations',
          nations: nations
        });
      });
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewNation: async (req, res, next) => {
    try {
      const nation = new Nations(req.body);
      const result = await nation.save().then(()=>{
        res.redirect('/nations');
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

  findNationById: async (req, res, next) => {
    const id = req.params.id;
    try {
    //   const nation = await Nation.findById(id);
      const nation = await Nations.findOne({ _id: id });
      if (!nation) {
        throw createError(404, 'Nation does not exist.');
      }
      res.send(nation);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Nation id'));
        return;
      }
      next(error);
    }
  },
  formEditNation: async (req, res, next) => {
    const id = req.params.id;
    try {
      //   const nation = await Nation.findById(id);
      const nation = await Nations.findOne({ _id: id }).then((nation) => {
        res.render('editNation', {
          title: 'edit Nation',
          nation: nation
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
  updateNation: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };

      const result = await Nations.findByIdAndUpdate(id, updates, options).then(()=>{
        res.redirect('/nations')
      });
      if (!result) {
        throw createError(404, 'Nation does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Nation Id'));
      }

      next(error);
    }
  },

  deleteANation: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Nations.findByIdAndDelete(id).then(() => {
        res.redirect("/nations");
      });
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Nation id'));
        return;
      }
      next(error);
    }
  }
};