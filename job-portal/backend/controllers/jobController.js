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


// ১. Employer তার নিজের পোস্ট করা জব এবং প্রতিটি জবে জমা পড়া আবেদন দেখবে
export const getEmployerJobsWithApplications = async (req, res) => {
  try {
    const employerId = req.user.id;

    const jobs = await prisma.job.findMany({
      where: { employerId },
      include: {
        applications: {
          include: {
            applicant: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employer jobs', error: error.message });
  }
};

// ২. Employer কোনো আবেদনের স্ট্যাটাস (SHORTLISTED / REJECTED) আপডেট করবে
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