import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ১. জবে আবেদন করা (Apply for Job with Resume File)
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.user?.id; // Auth Middleware ID

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // ফাইল আপলোড হয়েছে কিনা চেক
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume file' });
    }

    // আপলোড হওয়া ফাইলের পাবলিক URL তৈরি
    const resumeUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // আগে আবেদন করা হয়েছে কিনা চেক করা
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

    // নতুন অ্যাপ্লিকেশন ডাটাবেজে তৈরি
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId,
        resumeUrl,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Applied successfully with uploaded resume!', application });
  } catch (error) {
    console.error('Apply Error:', error);
    res.status(500).json({ message: error.message || 'Error applying for job' });
  }
};

// ২. অ্যাপ্লিক্যান্টের নিজের সব আবেদনের তালিকা (Get My Applications)
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