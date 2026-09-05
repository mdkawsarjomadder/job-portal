import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// User Profile Fetch
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        skills: true,
        resumeUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// User Profile Update
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, skills, resumeUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, skills, resumeUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        skills: true,
        resumeUrl: true,
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};