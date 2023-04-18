import jwt, { Secret } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as Secret; // or provide a default value instead of using `as Secret`

interface DecodedToken {
    username: string;
    iat: number;
    exp: number;
}

function createToken(username: string) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined!');
    }

    const token = jwt.sign({ username }, JWT_SECRET);
    return token;
}

function verifyToken(token: string) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined!');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export { createToken, verifyToken };
