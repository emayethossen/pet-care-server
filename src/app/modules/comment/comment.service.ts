import Comment from './comment.model';
import { IComment } from './comment.interface';

export const createComment = async (data: Partial<IComment>): Promise<IComment> => {
    const comment = new Comment(data);
    return comment.save();
};
