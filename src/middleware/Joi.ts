import Joi, {ObjectSchema} from "joi";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import Logging from "../library/Logging";

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            username: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string().required(),
        })
    },
}