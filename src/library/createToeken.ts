import jwt, { Secret } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as Secret; // or provide a default value instead of using `as Secret`

function createToken(username: string) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined!');
    }

    const token = jwt.sign({ username }, JWT_SECRET);
    return token;
}

export default createToken;