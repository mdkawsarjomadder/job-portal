// GET: Logged in user-এর সকল অ্যাপ্লাই করা জবের লিস্ট ও স্ট্যাটাস
router.get('/my-applications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // JWT থেকে পাওয়া ইউজার আইডি
    
    // Database থেকে user-এর অ্যাপ্লিকেশন ফেচ করা (Prisma/Mongoose/SQL অনুসারে)
    const applications = await prisma.application.findMany({
      where: { userId: userId },
      include: {
        job: {
          include: { employer: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});