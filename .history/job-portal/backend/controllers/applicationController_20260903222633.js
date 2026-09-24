import {PrismaClient} from '@prisma/client';


const prisma = new PrismaClient();

export const  applyForJob = async(req, res) =>
{
    try
    {
      const {jobId} = req.body;
      const applicantId = req.user.id;

      const existingApplication = await prisma.application.findFirst({
        where:{jobId, applicantId}
      });

      if(existingApplication)
      {
         return res.status(400).json({ message: 'You have already applied for this job' });     
      }

      const  application = await prisma.application.create({
        data: {
            jobId,
            applicantId,
            status: 'PENDING'
        }
      });
        res.status(201).json({ message: 'Applied successfully!', application });    }
    catch(err)
    {
        res.status(500).json({ message: 'Error applying for job', error: err.message });
    }
};