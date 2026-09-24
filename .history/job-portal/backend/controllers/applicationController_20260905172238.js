import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user?.id;

    const applications = await prisma.application.findMany({
      where: { applicantId },
      include: {
        job: {
          include: {
            employer: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Fetch Applications Error:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};