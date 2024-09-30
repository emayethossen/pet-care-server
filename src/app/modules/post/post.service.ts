import { IPetStory } from "./post.interface";
import PetStory from './post.model';

export const createPetStory = async (data: Partial<IPetStory>): Promise<IPetStory> => {
    const story = new PetStory(data);
    return story.save();
};

export const updatePetStory = async (id: string, data: Partial<IPetStory>): Promise<IPetStory | null> => {
    return PetStory.findByIdAndUpdate(id, data, { new: true });
};

export const deletePetStory = async (id: string, userId: string): Promise<IPetStory | null> => {
    const story = await PetStory.findById(id);

    if (!story) {
        throw new Error("Story not found");
    }

    console.log("User ID:", userId);
    console.log("Author ID:", story.author.toString());

    // Check if the story belongs to the user
    if (story.author.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    // Delete the story
    return await PetStory.findByIdAndDelete(id);
};



export const getPetStories = async (): Promise<IPetStory[]> => {
    return PetStory.find().populate('author').sort({ createdAt: -1 });
};

export const getPetStoryByCategory = async (category: string): Promise<IPetStory[]> => {
    return PetStory.find({ category }).populate('author').sort({ createdAt: -1 });
};
