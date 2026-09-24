import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

export const seedSuperAdmin = async () => {
  try {
    const adminEmail = 'admin@jobportal.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          phone: '+8801700000000',
        },
      });
      console.log('✅ Default Super Admin created: admin@jobportal.com / admin123');
    } else if (existingAdmin.role !== 'ADMIN') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' },
      });
      console.log('✅ Updated existing user to ADMIN: admin@jobportal.com');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
};
