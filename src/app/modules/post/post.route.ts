import express from 'express';
import {
    createPetStoryController,
    updatePetStoryController,
    deletePetStoryController,
    getPetStoriesController,
    getPetStoryByCategoryController,
    upvotePetStoryController,
    downvotePetStoryController,
    addCommentController,
    getPetStoryWithCommentsController,
    getSinglePetStoryController,
    getUserPosts,
} from './post.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// Apply authMiddleware to routes that require authentication
router.post('/posts', authMiddleware, createPetStoryController);
router.put('/posts/:id', authMiddleware, updatePetStoryController);
router.delete('/posts/:id', authMiddleware, deletePetStoryController);

router.post('/posts/:id/upvote', authMiddleware, upvotePetStoryController); // Upvote route
router.post('/posts/:id/downvote', authMiddleware, downvotePetStoryController); // Downvote route
router.post('/posts/:id/comments', authMiddleware, addCommentController); // Add comment to a story
// router.get('/posts/:id', getPetStoryWithCommentsController);
// Get a single pet story
router.get('/posts/:id', getSinglePetStoryController);

router.get('/my-posts', authMiddleware, getUserPosts);

// Public routes
router.get('/posts', getPetStoriesController);
router.get('/posts/category/:category', getPetStoryByCategoryController);

export const PostRoutes = router;
