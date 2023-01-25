const router = require("express").Router();
const {createComments,getCommentOfParticularTask,removeCommentFromTask} = require('../../controllers/comment.controller')
const {verifyToken} = require('../../middleware/auth')

router.post('/:taskId/createComment',verifyToken,createComments)


router.get('/:taskId/getCommentOfTask',verifyToken,getCommentOfParticularTask)


router.delete('/:taskId/removeCommentFromTask',verifyToken,removeCommentFromTask)





module.exports = router;