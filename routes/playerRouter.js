const express = require('express');
const router = express.Router();

const PlayerController = require('../controllers/playerController');

router.get('/', PlayerController.getAllPlayers);

router.post('/', PlayerController.createNewPlayers);

router.get('/:id', PlayerController.findPlayerById);

router.get('/edit/:id', PlayerController.formEditPlayer);

router.post('/edit/:id', PlayerController.updatePlayer);

router.get('/deleteOnePlayer/:id', PlayerController.deleteAPlayer);

module.exports = router;