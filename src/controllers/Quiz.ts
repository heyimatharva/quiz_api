import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz';
import User from '../models/User';
import { verifyToken } from '../library/Token';

const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded_user = verifyToken(token);
            const { name, description = null, datetime: dateString } = req.body;
            const datetime = new Date(dateString);
            const user = await User.findOne({ username: decoded_user.username });

            if (user) {
                const quiz = new Quiz({
                    _id: new mongoose.Types.ObjectId(),
                    name,
                    description,
                    datetime,
                    user: user._id
                });
                const savedQuiz = await quiz.save();
                return res.status(201).json({ quiz: savedQuiz });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
};

const getQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const quiz_id = req.params.id;
            const token = authHeader.split(' ')[1];
            verifyToken(token);

            const quiz = await Quiz.findById(quiz_id);
            if (quiz) {
                return res.status(200).json({ quiz });
            } else {
                return res.status(404).json({ message: 'Quiz not found' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
};

const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const user = verifyToken(token);
            if (user) {
                const quiz_id = req.params.id;
                const old_quiz = await Quiz.findById(quiz_id);
                const user_object = await User.findOne({ username: user.username });

                if (old_quiz && user_object) {
                    if (!old_quiz.user.equals(user_object._id)) {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }

                    const { name = old_quiz.name, description = old_quiz.description, datetime = old_quiz.datetime } = req.body;
                    const quiz = await Quiz.findByIdAndUpdate(quiz_id, { name, description, datetime }, { new: true });
                    res.status(200).json({ quiz });
                } else {
                    res.status(404).json({ message: 'Quiz not found' });
                }
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
};

const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const user = verifyToken(token);
            if (user) {
                const quiz_id = req.params.id.toString();

                const old_quiz = await Quiz.findById(quiz_id);
                const user_object = await User.findOne({ username: user.username });
                if (old_quiz && user_object) {
                    if (!old_quiz.user.equals(user_object._id)) {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                    const quiz = await Quiz.findByIdAndDelete(quiz_id);
                    if (quiz) {
                        res.status(200).json({ message: 'Quiz deleted' });
                    } else {
                        res.status(404).json({ message: 'Quiz not found' });
                    }
                } else {
                    res.status(404).json({ message: 'Quiz not found' });
                }
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
};

export default { createQuiz, getQuiz, updateQuiz, deleteQuiz };
