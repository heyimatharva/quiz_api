import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const createUser = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name, user_type } = req.body;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password,
        name,
        user_type
    });

    return user
        .save()
        .then((user) => res.status(201).json({ user }))
        .catch((error) => res.status(500).json({ error }));
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return User.findOne({ username: userId })
        .then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createUser, readUser };
