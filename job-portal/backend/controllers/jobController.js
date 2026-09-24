import prisma from '../lib/prisma.js';
import { sendStatusEmail, sendInterviewEmail } from '../utils/email.js';

// ১. নতুন জব পোস্ট করা (Only EMPLOYER)
export const createJob = async (req, res) => {
  try {
    const { title, description, category, location, salary, jobType } = req.body;

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

// ২. জবের তালিকা পাওয়া এবং নিখুঁত সার্চ/ফিল্টার সাপোর্ট করা
export const getAllJobs = async (req, res) => {
  try {
    const { search, category, location, jobType } = req.query;

    const whereClause = {};

    if (search && search.trim() !== '') {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (category && category.trim() !== '') {
      whereClause.category = { contains: category.trim(), mode: 'insensitive' };
    }

    if (location && location.trim() !== '') {
      whereClause.location = { contains: location.trim(), mode: 'insensitive' };
    }

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

// ৩. Employer তার নিজের পোস্ট করা জব এবং জমা পড়া আবেদনসমূহ রেজুমিসহ দেখবে
export const getEmployerJobsWithApplications = async (req, res) => {
  try {
    const employerId = req.user?.id;

    const jobs = await prisma.job.findMany({
      where: { employerId },
      include: {
        applications: {
          include: {
            applicant: {
              select: { id: true, name: true, email: true, phone: true, avatar: true },
            },
          },
          orderBy: { appliedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// ২.১ নির্দিষ্ট একটি জবের বিস্তারিত তথ্য পাওয়া (Get Single Job By ID)
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job details', error: error.message });
  }
};

// ৪. Employer আবেদনের স্ট্যাটাস (SHORTLISTED / REJECTED) আপডেট করবে (With Authorization)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ message: 'Only employers can update application status.' });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this application' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        applicant: { select: { name: true, email: true } },
        job: { select: { title: true } },
      },
    });

    if (updatedApplication.applicant?.email) {
      sendStatusEmail(
        updatedApplication.applicant.email,
        updatedApplication.applicant.name,
        updatedApplication.job.title,
        status
      );
    }

    res.status(200).json({
      message: 'Status updated and email notification initiated',
      updatedApplication,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// ৫. পোস্ট করা জব এডিট করা (Only Employer & Job Owner)
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, description, category, location, salary, jobType } = req.body;

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

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

// ৬. পোস্ট করা জব ডিলিট করা (Only Employer & Job Owner)
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

    await prisma.application.deleteMany({
      where: { jobId },
    });

    await prisma.job.delete({
      where: { id: jobId },
    });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

// ৭. Schedule Interview, Save to Database & Send Notification
export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      phone,
      phoneNumber,
      message,
      date,
      time,
      type,
      locationOrLink,
      jobTitle,
      applicantName,
    } = req.body;

    const recipientPhone = phone || phoneNumber;

    if (!recipientPhone) {
      return res.status(400).json({ message: 'Applicant phone number is missing' });
    }

    if (!date || !time || !locationOrLink) {
      return res.status(400).json({ message: 'Interview date, time, and location/link are required' });
    }

    let updatedApplication = null;

    // ১. ডাটাবেজে অ্যাপ্লিকেশন থাকলে ইন্টারভিউ তথ্য সেভ করা
    if (applicationId) {
      updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: {
          interviewDate: date,
          interviewTime: time,
          interviewType: type || 'In-Person',
          interviewLocation: locationOrLink,
          interviewPhone: recipientPhone,
          status: 'SHORTLISTED',
        },
        include: {
          applicant: { select: { id: true, name: true, email: true, phone: true } },
          job: { select: { title: true } },
        },
      });

      // ক্যান্ডিডেটের একাউন্টে ফোন নম্বর সেট না থাকলে আপডেট করে রাখা
      if (updatedApplication.applicant?.id) {
        await prisma.user.update({
          where: { id: updatedApplication.applicant.id },
          data: { phone: recipientPhone },
        }).catch(() => {});
      }

      // ২. ক্যান্ডিডেটের ইমেইলে ইন্টারভিউ নোটিফিকেশন পাঠানো
      if (updatedApplication.applicant?.email) {
        sendInterviewEmail(
          updatedApplication.applicant.email,
          updatedApplication.applicant.name || applicantName,
          updatedApplication.job.title || jobTitle,
          { date, time, type: type || 'In-Person', locationOrLink }
        );
      }
    }

    const smsMessage =
      message ||
      `Hello ${applicantName || 'Candidate'}, Your interview for '${jobTitle || 'Job'}' is set on ${date} at ${time}. Venue/Link: ${locationOrLink}`;

    console.log(`[SMS Gateway Simulated] Sent to ${recipientPhone}: ${smsMessage}`);

    return res.status(200).json({
      success: true,
      message: 'Interview scheduled, saved to database, and invitation sent successfully!',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Schedule Interview Error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to schedule interview',
    });
  }
};