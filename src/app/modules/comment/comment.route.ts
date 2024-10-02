import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
    createCommentController,
    updateCommentController,
    deleteCommentController,
    getCommentsByPostController,
} from './comment.controller';

const router = express.Router();

// Comment Routes
router.post('/posts/:postId/comments', authMiddleware, createCommentController);
router.put('/comments/:commentId', authMiddleware, updateCommentController);
router.delete('/comments/:commentId', authMiddleware, deleteCommentController);
router.get('/posts/:postId/comments', getCommentsByPostController);

export const CommentRoutes = router;
