import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

//user registration-----------------------|
export const register = async (req, res) =>{
    try{
        const {name, email, password, role} = req.body;
        const existingUser = await prisma.user.findUnique({where: {email}});
        if(existingUser)
        {
            return res.status(400).json({message: 'User with this email already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser =  await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role:role || 'APPLICANT'
            }
        });
        res.status(201).json({message: 'User created successfully', userId: newUser.id});
    }
    catch(error)
    {
        res.status(500).json({message: 'Error registering user', error: error.message})
    }
}