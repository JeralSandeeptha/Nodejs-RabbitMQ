const express = require('express');

const { 
    getAllComments, 
    getComment,
    updateComment,
    deleteComment,
    createComment
} = require('../controllers/commentControllers');

const router = express.Router();

router.post('/', createComment);
router.get('/', getAllComments);
router.get('/:commentId', getComment);
router.delete('/:commentId', deleteComment);
router.put('/:commentId', updateComment);

module.exports = router;