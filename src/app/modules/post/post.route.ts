import express from 'express';
import {
    createPetStoryController,
    updatePetStoryController,
    deletePetStoryController,
    getPetStoriesController,
    getPetStoryByCategoryController,
    upvotePetStoryController,
    downvotePetStoryController,
    getSinglePetStoryController,
    getUserPosts,
    getAllUserContentController,
} from './post.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// Apply authMiddleware to routes that require authentication
router.post('/posts', authMiddleware, createPetStoryController);
router.put('/posts/:id', authMiddleware, updatePetStoryController);
router.delete('/posts/:id', authMiddleware, deletePetStoryController);

router.post('/posts/:id/upvote', authMiddleware, upvotePetStoryController); 
router.post('/posts/:id/downvote', authMiddleware, downvotePetStoryController); 
// Get a single pet story
router.get('/posts/:id', getSinglePetStoryController);

router.get('/my-posts', authMiddleware, getUserPosts);

// Public routes
router.get('/posts', getPetStoriesController);
router.get('/posts/category/:category', getPetStoryByCategoryController);

router.get('/admin/content', authMiddleware, getAllUserContentController);

export const PostRoutes = router;
