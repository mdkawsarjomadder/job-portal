import prisma from '../lib/prisma.js';

// ১. সামগ্রিক প্ল্যাটফর্ম অ্যানালিটিক্স ও স্ট্যাটাস (Admin Dashboard Overview)
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalEmployers,
      totalApplicants,
      totalJobs,
      totalApplications,
      shortlistedCount,
      recentUsers,
      recentJobs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'EMPLOYER' } }),
      prisma.user.count({ where: { role: 'APPLICANT' } }),
      prisma.job.count(),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'SHORTLISTED' } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true, avatar: true },
      }),
      prisma.job.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          employer: { select: { name: true, email: true } },
          _count: { select: { applications: true } },
        },
      }),
    ]);

    res.status(200).json({
      totalUsers,
      totalEmployers,
      totalApplicants,
      totalJobs,
      totalApplications,
      shortlistedCount,
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats', error: error.message });
  }
};

// ২. সকল ইউজারদের তালিকা দেখা ও সার্চ করা (All Users List)
export const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    const whereClause = {};

    if (role && role !== 'ALL') {
      whereClause.role = role;
    }

    if (search && search.trim() !== '') {
      whereClause.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            jobs: true,
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// ৩. ইউজারের রোল পরিবর্তন করা (Change User Role: APPLICANT, EMPLOYER, ADMIN)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['APPLICANT', 'EMPLOYER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

// ৪. কোনো ইউজার ডিলিট করা (Delete User & Cascade related records)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-deletion
    if (req.user.id === userId) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    // 1. Delete applications made by this user
    await prisma.application.deleteMany({
      where: { applicantId: userId },
    });

    // 2. Find jobs posted by this user (if employer) and delete their applications
    const employerJobs = await prisma.job.findMany({
      where: { employerId: userId },
      select: { id: true },
    });

    const jobIds = employerJobs.map((j) => j.id);
    if (jobIds.length > 0) {
      await prisma.application.deleteMany({
        where: { jobId: { in: jobIds } },
      });
      await prisma.job.deleteMany({
        where: { employerId: userId },
      });
    }

    // 3. Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// ৫. প্ল্যাটফর্মের সকল জব দেখা (All Jobs Overview for Admin)
export const getAllJobsAdmin = async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = {};
    if (search && search.trim() !== '') {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { location: { contains: search.trim(), mode: 'insensitive' } },
        { category: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        employer: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// ৬. স্প্যাম বা ভুয়া জব ডিলিট করা (Admin Delete Job)
export const deleteJobAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;

    await prisma.application.deleteMany({
      where: { jobId },
    });

    await prisma.job.delete({
      where: { id: jobId },
    });

    res.status(200).json({ message: 'Job deleted successfully by Admin' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

// ৭. প্ল্যাটফর্মের সকল আবেদন পর্যবেক্ষণ (All Applications Overview)
export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        applicant: { select: { id: true, name: true, email: true, phone: true } },
        job: {
          select: {
            id: true,
            title: true,
            employer: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};
