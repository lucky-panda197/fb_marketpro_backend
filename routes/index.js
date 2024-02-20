const express = require('express');
const router = express.Router();
const authRouter = require('./AuthRouter');
const vpsRouter = require('./VpsRouter');
const groupRouter = require('./GroupRouter');
const postRouter = require('./PostRouter');
const pageRouter = require('./PageRouter');


router.use('/auth', authRouter);
router.use('/vps', vpsRouter);
router.use('/groups', groupRouter);
router.use('/posts', postRouter);
router.use('/pages', pageRouter);


module.exports = router;