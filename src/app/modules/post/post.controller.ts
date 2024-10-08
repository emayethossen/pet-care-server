import { Request, Response } from 'express';
import { IPetStory } from './post.interface';
import PetStory from './post.model';
import { createPetStory, deletePetStory, downvotePetStory, getPetStories, getPetStoryByCategory, getSinglePost, updatePetStory, upvotePetStory } from './post.service';
import Payment from '../payments/payment.model'

export const createPetStoryController = async (req: Request, res: Response) => {
    try {
        const { title, content, category, coverImage, isPremium } = req.body;
        const storyData: Partial<IPetStory> = {
            title,
            content,
            category,
            coverImage,
            isPremium,
            author: req.user?._id,
        };

        const story = await createPetStory(storyData);
        res.status(201).json(story);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating story', error: error.message });
    }
};

export const updatePetStoryController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id; // Get the current user's ID
        const { id } = req.params; // The post ID

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized: No user information',
            });
        }

        // Find the story by ID
        const story = await PetStory.findById(id);

        if (!story) {
            return res.status(404).json({
                message: 'Story not found',
            });
        }

        // Check if the current user is the author of the story
        if (story.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Forbidden: You are not allowed to update this post',
            });
        }

        // If the user is the author, proceed with the update
        const updatedStory = await updatePetStory(id, req.body);
        res.status(200).json(updatedStory);
    } catch (error: any) {
        res.status(500).json({
            message: 'Error updating story',
            error: error.message,
        });
    }
};


export const deletePetStoryController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }

        // Attempt to delete the story
        await deletePetStory(req.params.id, userId.toString());
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting story', error: error.message });
    }
};

export const getPetStoriesController = async (req: Request, res: Response) => {
    try {
        const stories = await getPetStories();
        res.json(stories);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching stories', error: error.message });
    }
};

export const getUserPosts = async (req: Request, res: Response) => {
    const userId = req.user?._id;  // Extract user ID from the JWT token

    try {
        const posts = await PetStory.find({ author: userId });  // Fetch posts authored by this user
        return res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        return res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

// Get a single pet story
export const getSinglePetStoryController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const story = await getSinglePost(id); // Fetch the single post

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json({
            success: true,
            data: story
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching story',
            error: error.message,
        });
    }
};

export const getPetStoryByCategoryController = async (req: Request, res: Response) => {
    try {
        const stories = await getPetStoryByCategory(req.params.category);
        res.json(stories);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching stories by category', error: error.message });
    }
};

// Upvote a story
export const upvotePetStoryController = async (req: Request, res: Response) => {
};

// Downvote a story
export const downvotePetStoryController = async (req: Request, res: Response) => {
};


// Get pet story with comments
export const getPetStoryWithCommentsController = async (req: Request, res: Response) => {
    try {
        const story = await PetStory.findById(req.params.id)
            .populate('author')  // Populate author info
            .populate({
                path: 'comments',
                populate: { path: 'author' }  // Populate comment authors
            });

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json({
            success: true,
            data: story
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching story with comments',
            error: error.message,
        });
    }
};

// Fetch premium content by postId and verify payment
export const getPremiumContent = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?._id; // Assuming you have `req.user` from the auth middleware

    try {
        // Find the post by ID
        const post = await PetStory.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the content is premium
        if (!post.isPremium) {
            return res.status(200).json({ data: post });
        }

        // If content is premium, check if the user has paid for it
        const hasAccess = await Payment.findOne({
            userId,
            postId,
            status: 'succeeded', // Only allow access if payment succeeded
        });

        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied. Please make payment to access premium content." });
        }

        // If payment is verified, return the premium content
        res.status(200).json({ data: post });
    } catch (error) {
        console.error('Error fetching premium content:', error);
        res.status(500).json({ message: "Error fetching premium content" });
    }
};

// Fetch all content
export const getAllUserContentController = async (req: Request, res: Response) => {
    try {
        const stories = await PetStory.find()
            .populate('author', 'name email') // Populate author information
            .sort({ createdAt: -1 }); // Sort by creation date

        res.status(200).json({ message: 'Fetched all user content successfully.', data: stories });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch user content.', error: error.message });
    }
};