import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) =>
    {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
    {
        return res.status(401).json({
            message:'Access Denied: No Token Provided'
        });
    }
    try
    {
      const varified  = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();

    }catch(error)
    {
        res.status(400).json({message:'Invalid or Expired Token'});
    }
    }
