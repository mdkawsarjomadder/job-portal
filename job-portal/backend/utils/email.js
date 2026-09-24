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
        const isShortlisted = status === 'SHORTLISTED';

        const mailOptions = {
            from: `"Job Portal" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: isShortlisted
                ? `Congratulations! You've been Shortlisted for ${jobTitle}`
                : `Update regarding your application for ${jobTitle}`,
            html: `
               <div style="font-family: sans-serif; padding: 20px; color: #333;">
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

export const sendInterviewEmail = async (toEmail, applicantName, jobTitle, details) => {
    try {
        const { date, time, type, locationOrLink } = details;
        const mailOptions = {
            from: `"Job Portal" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `🎯 Interview Scheduled: ${jobTitle}`,
            html: `
                <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #6d28d9; margin-top: 0;">Congratulations ${applicantName}!</h2>
                    <p style="font-size: 15px; line-height: 1.6;">You have been scheduled for an interview for the position of <strong>${jobTitle}</strong>.</p>
                    
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
                        <p style="margin: 6px 0; font-size: 14px;">📅 <strong>Date:</strong> ${date}</p>
                        <p style="margin: 6px 0; font-size: 14px;">⏰ <strong>Time:</strong> ${time}</p>
                        <p style="margin: 6px 0; font-size: 14px;">🏢 <strong>Type:</strong> ${type || 'In-Person'}</p>
                        <p style="margin: 6px 0; font-size: 14px;">📍 <strong>Venue / Link:</strong> ${locationOrLink}</p>
                    </div>

                    <p style="font-size: 14px; color: #64748b;">Please be prepared and join on time. Best of luck!</p>
                    <br/>
                    <p style="margin: 0; font-size: 14px;">Best regards,<br/><strong>Job Portal Team</strong></p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Interview email successfully sent to ${toEmail}`);
    } catch (err) {
        console.error('Error sending interview email:', err.message);
    }
};