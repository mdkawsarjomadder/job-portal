import prisma from "../lib/prisma.js";

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
        avatar: true, // 👈 avatar সিলেক্ট যুক্ত করা হয়েছে
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

    // 📷 যদি নতুন ছবি আপলোড করা হয়ে থাকে তবে তার URL তৈরি করুন
    let avatarUrl = req.body.avatar;
    if (req.file) {
      avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        name, 
        phone, 
        skills, 
        resumeUrl,
        ...(avatarUrl && { avatar: avatarUrl }), // 👈 যদি avatarUrl থাকে তবেই সেভ হবে
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        skills: true,
        resumeUrl: true,
        avatar: true, // 👈 রিটার্ন রেসপন্সে avatar যুক্ত করা হয়েছে
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};