import { Request, Response } from 'express';
import Comment from './comment.model';
import PetStory from '../post/post.model';

export const createCommentController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;  // Authenticated user's ID
        const { postId } = req.params;  // Post ID (PetStory ID)
        const { content } = req.body;

        // Create the comment
        const newComment = new Comment({
            story: postId,    // Reference the post (PetStory)
            author: userId,   // Authenticated user is the author
            content: content
        });

        // Save the comment
        const savedComment = await newComment.save();

        // Add the comment ID to the corresponding post's comments array
        await PetStory.findByIdAndUpdate(postId, {
            $push: { comments: savedComment._id }
        });

        res.status(201).json({
            success: true,
            message: 'Comment created and added to the post successfully',
            data: savedComment,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating comment',
            error: error.message,
        });
    }
};

// Update a comment
export const updateCommentController = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user?._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Access the correct property here
        if (comment.author.toString() !== userId?.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this comment',
            });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: comment,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating comment',
            error: error.message,
        });
    }
};

// Delete a comment
export const deleteCommentController = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Access the correct property here
        if (comment.author.toString() !== userId?.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this comment',
            });
        }

        await comment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message,
        });
    }
};

// Get all comments for a specific post
export const getCommentsByPostController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ story: postId }).populate('author', 'username'); // Update here
        res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message,
        });
    }
};
