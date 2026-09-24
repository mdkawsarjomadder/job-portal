    import { PrismaClient } from '@prisma/client';
    import bcrypt from 'bcryptjs'; 
    import jwt from 'jsonwebtoken';
    import prisma from '../lib/prisma.js';
   

    //user registration-----------------------|


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // মিডলওয়্যারের সাথে মিলিয়ে একই সিক্রেট কি ব্যবহার করা
    const secretKey = process.env.JWT_SECRET || 'mysecretkey12345';

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }

};          //lOGIN END-------------------------|