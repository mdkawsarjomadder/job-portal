import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ১. নতুন জব পোস্ট করা (Only EMPLOYER)
export const createJob = async (req, res) => {
  try {
    const { title, description, category, location, salary, jobType } = req.body;

    // চেক করা ইউজার EMPLOYER কিনা
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ message: 'Only employers can post jobs.' });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        category,
        location,
        salary,
        jobType,
        employerId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
};

// ২. সব জবের তালিকা পড়া
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employer: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// ৩. Employer তার নিজের পোস্ট করা জব এবং জমা পড়া আবেদনসমূহ রেজুমিসহ দেখবে
export const getEmployerJobsWithApplications = async (req, res) => {
  try {
    const employerId = req.user?.id;

    const jobs = await prisma.job.findMany({
      where: { employerId },
      include: {
        applications: {
          include: {
            applicant: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { appliedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// ৪. Employer আবেদনের স্ট্যাটাস (SHORTLISTED / REJECTED) আপডেট করবে
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // 'SHORTLISTED' or 'REJECTED'

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    res.status(200).json({ message: 'Status updated successfully', updatedApplication });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};


//Update cretae------------------------|

// ১. পোস্ট করা জব এডিট করা (Only Employer & Job Owner)
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, description, category, location, salary, jobType } = req.body;

    // জবটি ডাটাবেজে আছে কিনা তা চেক করা
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // চেক করা যে ইউজার এই জবের অনার (Owner) কিনা
    if (existingJob.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this job' });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        description,
        category,
        location,
        salary,
        jobType,
      },
    });

    res.status(200).json({ message: 'Job updated successfully', updatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
};

// ২. পোস্ট করা জব ডিলিট করা (Only Employer & Job Owner)
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (existingJob.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this job' });
    }

    // প্রথমে এই জবে জমা হওয়া সব অ্যাপ্লিকেশন মুছে ফেলা
    await prisma.application.deleteMany({
      where: { jobId },
    });

    // এরপর মূল জবটি ডিলিট করা
    await prisma.job.delete({
      where: { id: jobId },
    });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};