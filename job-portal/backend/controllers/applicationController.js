import prisma from '../lib/prisma.js';

// ১. জবে আবেদন করা (Apply for Job with Resume File)
export const applyForJob = async (req, res) => {
  try {
    const { jobId, phone } = req.body;
    const applicantId = req.user?.id; // Auth Middleware থেকে প্রাপ্ত ID

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // ফাইল আপলোড হয়েছে কিনা চেক
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume file' });
    }

    // জব বিদ্যমান কিনা চেক করা
    const targetJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!targetJob) {
      return res.status(404).json({ message: 'Job not found or has been removed' });
    }

    // ডাইনামিক হোস্ট ইউআরএল তৈরি (যেমন: http://localhost:5000/uploads/filename.pdf)
    const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // আগে আবেদন করা হয়েছে কিনা চেক করা
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

    // ক্যান্ডিডেটের প্রোফাইলে ফোন নম্বর না থাকলে আপডেট করা (যাতে এমপ্লয়ার কল/এসএমএস দিতে পারে)
    if (phone) {
      await prisma.user.update({
        where: { id: applicantId },
        data: { phone },
      }).catch(() => {}); // optional update
    }

    // নতুন অ্যাপ্লিকেশন ডাটাবেজে তৈরি
    const application = await prisma.application.create({
      data: {
        jobId: jobId,
        applicantId: applicantId,
        resumeUrl: resumeUrl,
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