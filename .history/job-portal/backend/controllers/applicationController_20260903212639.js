import {PrismaClient} from '@prisma/client';


const prisma = new PrismaClient();

export const  applyForJob = async(req, res) =>
{
    try
    {
      const {jobId} = req.body;
      const applicantId = req.user.id;
    }
    catch(err)
    {

    }
}