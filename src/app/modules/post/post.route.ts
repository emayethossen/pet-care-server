import express from 'express';
import {
    createPetStoryController,
    updatePetStoryController,
    deletePetStoryController,
    getPetStoriesController,
    getPetStoryByCategoryController,
} from './post.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// Apply authMiddleware to routes that require authentication
router.post('/stories', authMiddleware, createPetStoryController);
router.put('/stories/:id', authMiddleware, updatePetStoryController);
router.delete('/stories/:id', authMiddleware, deletePetStoryController);

// Public routes
router.get('/stories', getPetStoriesController);
router.get('/stories/category/:category', getPetStoryByCategoryController);

export const PostRoutes = router;
