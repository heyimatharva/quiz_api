import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';
import Logging from '../library/Logging';
import createToken from '../library/createToeken';

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate and return session token
        const token = createToken(user.username)

        console.log(token);
        return res.status(200).json({ message: 'Login successful!', user: user.username, token });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to check user' });
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({ message: 'Logout successful!' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to logout user' });
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password: hashedPassword,
        name
    });

    try {
        const savedUser = await user.save();
        return res.status(201).json({ user: savedUser });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Failed to save user' });
    }
};


const userExist = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({ username });

        if (user) {
            return res.status(404).json({ message: `${username} is not available` });
        } else {
            return res.status(200).json({ message: `${username} is available` });
        }
    } catch (error) {
        Logging.error(error);
        
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

export default { createUser, checkUser, userExist, logout };
