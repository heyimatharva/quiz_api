import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        return res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name } = req.body;
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password: hashedPassword,
        name
    });

    return await user
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

export default { createUser, readUser, checkUser };
