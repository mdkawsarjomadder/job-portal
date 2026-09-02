import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'mysecretkey12345';
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (error) {
    console.log('Token error:', error.message);
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};