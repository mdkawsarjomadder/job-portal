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