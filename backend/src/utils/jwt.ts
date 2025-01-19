import jwt from 'jsonwebtoken';

// Define the structure of the payload
interface TokenPayload {
  id: string;
  [key: string]: any; // Allow additional properties
}

// Define the structure of the decoded token
interface DecodedToken extends TokenPayload {
  iat?: number; // Issued at (optional)
  exp?: number; // Expiration time (optional)
}

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

/**
 * Sign a JWT token
 * @param payload - The payload to include in the token
 * @param expiresIn - Expiration time (e.g., '1h', '7d')
 * @returns Signed JWT token
 */
export const signToken = (payload: TokenPayload, expiresIn: string | number = '1h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param token - The JWT token to verify
 * @returns Decoded token if valid, otherwise null
 */
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};