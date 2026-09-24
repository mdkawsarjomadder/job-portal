import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeUrl } = req.body;
    const applicantId = req.user?.id; // Auth Middleware থেকে প্রাপ্ত ID

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // ১. আগে আবেদন করা হয়েছে কিনা চেক
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId: jobId,
          applicantId: applicantId,
        },
      },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // ২. নতুন অ্যাপ্লিকেশন ডাটাবেজে তৈরি
    const application = await prisma.application.create({
      data: {
        jobId: jobId,             // String (UUID)
        applicantId: applicantId, // String (UUID)
        resumeUrl: resumeUrl || 'https://example.com/default-resume.pdf', // Schema অনুযায়ী required
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Applied successfully!', application });
  } catch (error) {
    console.error('Apply Error:', error);
    res.status(500).json({ message: error.message || 'Error applying for job' });
  }
};