import { Request, Response } from 'express';
import { IPetStory } from './post.interface';
import { createPetStory, deletePetStory, getPetStories, getPetStoryByCategory, updatePetStory } from './post.service';

export const createPetStoryController = async (req: Request, res: Response) => {
    try {
        const { title, content, category, images } = req.body;
        const storyData: Partial<IPetStory> = {
            title,
            content,
            category,
            images,
            author: req.user._id, // assuming user is authenticated
        };

        const story = await createPetStory(storyData);
        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ message: 'Error creating story', error: error.message });
    }
};

export const updatePetStoryController = async (req: Request, res: Response) => {
    try {
        const story = await updatePetStory(req.params.id, req.body);
        res.json(story);
    } catch (error) {
        res.status(500).json({ message: 'Error updating story', error: error.message });
    }
};

export const deletePetStoryController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;  // Ensure user ID is coming from authenticated user
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }

        // Attempt to delete the story
        await deletePetStory(req.params.id, userId.toString());  // Ensure ID is passed as string
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting story', error: error.message });
    }
};

export const getPetStoriesController = async (req: Request, res: Response) => {
    try {
        const stories = await getPetStories();
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stories', error: error.message });
    }
};

export const getPetStoryByCategoryController = async (req: Request, res: Response) => {
    try {
        const stories = await getPetStoryByCategory(req.params.category);
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stories by category', error: error.message });
    }
};
