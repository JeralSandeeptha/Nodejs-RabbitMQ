const express = require('express');
const {
    createPost,
    deletePost,
    getPost,
    getAllPosts,
    updatePost
} = require('../controllers/postControllers');

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:postId', getPost);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);

module.exports = router;