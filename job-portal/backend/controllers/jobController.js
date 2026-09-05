import { PrismaClient } from '@prisma/client';
import { sendStatusEmail } from '../utils/email.js';

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


// জবের তালিকা পাওয়া এবং নিখুঁত সার্চ/ফিল্টার সাপোর্ট করা
export const getAllJobs = async (req, res) => {
  try {
    const { search, category, location, jobType } = req.query;

    const whereClause = {};

    // ১. সার্চ কিওয়ার্ড (Title বা Description-এ খোঁজাবে)
    if (search && search.trim() !== '') {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // ২. ক্যাটাগরি ফিল্টার
    if (category && category.trim() !== '') {
      whereClause.category = { contains: category.trim(), mode: 'insensitive' };
    }

    // ৩. লোকেশন ফিল্টার
    if (location && location.trim() !== '') {
      whereClause.location = { contains: location.trim(), mode: 'insensitive' };
    }

    // ৪. জব টাইপ ফিল্টার (Case-insensitive matching)
    if (jobType && jobType.trim() !== '') {
      whereClause.jobType = { contains: jobType.trim(), mode: 'insensitive' };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
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
    const { status } = req.body;

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        applicant: {select: {name: true, email: true}},
        job: {select: {title: true}},
      }
    });

    //backend send email-------
    if(updateApplicationStatus.applicant?.email)
    {
      sendStatusEmail
      (
        updateApplicationStatus.applicant.email,
        updateApplicationStatus.applicant.name,
        updateApplicationStatus.job.title,
        status
      );
    }

    res.status(200).json(
      { message: 'Status updated and email notification initiated'
        , updatedApplication });
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