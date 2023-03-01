const express = require('express');
const router = express.Router();

const NationController = require('../controllers/nationController');

router.get('/', NationController.getAllNations);

router.post('/', NationController.createNewNation);

router.get('/:id', NationController.findNationById);

router.get('/edit/:id', NationController.formEditNation);

router.post('/edit/:id', NationController.updateNation);

router.get('/deleteOneNation/:id', NationController.deleteANation);

module.exports = router;