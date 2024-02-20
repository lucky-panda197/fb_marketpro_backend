const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken');

/* define controller */
const GroupController = require('../controllers/GroupController');

/* define routes */
router
    .get('/', GroupController.getGroups)
    .get('/:slug', GroupController.getGroup)
    .post('/create', verifyToken, GroupController.createGroup)
    .put('/:id', verifyToken, GroupController.updateGroup)
    .delete('/:id', verifyToken, GroupController.deleteGroup);

module.exports = router;