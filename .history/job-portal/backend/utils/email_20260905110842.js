import nodemailer from 'nodemailer';


// Nodemailer Transporter সেটআপ (Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email Digite
        pass: process.env.EMAIL_PASS, // Gamail in  (App Password)
    },
});

export const sendStatusEmail = async(toEmail, applicantName, jobTitle, status) => {
    try
    {
        const isShortListed = status === 'SHORTLISTED';

        const mailOptions = {
            from: `"Job Portal" <${process.env.EMAIL_USER}>"`,
            to: toEmail,
            subject: isShortListed
                ? `Congratulations! You've been Shortlisted for ${jobTitle}`
                : `Update regarding your application for ${jobTitle}`,
            html: `
               <div font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Hello ${applicantName},</h2>
          <p>Your job application status for <strong>${jobTitle}</strong> has been updated.</p>
          <div style="background: ${isShortlisted ? '#ecfdf5' : '#fff1f2'}; border-left: 4px solid ${isShortlisted ? '#10b981' : '#f43f5e'}; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold; color: ${isShortlisted ? '#047857' : '#be123c'};">
              Status: ${status}
            </p>
          </div>
          <p>${
            isShortlisted
              ? 'The employer liked your profile and wants to proceed to the next stage. Expect further updates soon!'
              : 'Thank you for your interest and effort. Unfortunately, the employer has decided not to move forward with your application at this time.'
          }</p>
          <br/>
          <p>Best regards,<br/>Job Portal Team</p>
        </div> `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${toEmail}`);
    }
    catch(err)
    {
        console.error('Error sending email:', err.message);
    }
};