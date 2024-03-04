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
    .post('/:id/check', GroupController.checkGroup)
    .put('/:id', verifyToken, GroupController.updateGroup)
    .put('/:id/assign_group', verifyToken, GroupController.assignGroup)
    .put('/:id/remove_assign_group', verifyToken, GroupController.removeAssignGroup)
    .delete('/:id', verifyToken, GroupController.deleteGroup);

module.exports = router;