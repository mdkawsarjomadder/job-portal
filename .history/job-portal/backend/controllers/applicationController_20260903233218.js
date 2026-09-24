import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ১. জবে আবেদন করা
export const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeUrl } = req.body;
    const applicantId = req.user?.id;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId,
        },
      },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId,
        resumeUrl: resumeUrl || 'https://example.com/default-resume.pdf',
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Applied successfully!', application });
  } catch (error) {
    console.error('Apply Error:', error);
    res.status(500).json({ message: error.message || 'Error applying for job' });
  }
};

// ২. কোনো অ্যাপ্লিক্যান্ট নিজের সব আবেদন দেখতে
export const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user.id;

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
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};