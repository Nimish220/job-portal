import nodemailer from 'nodemailer';
export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS, 
        },
    });

    const mailOptions = {
        from: `JobPortal Support <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #5F9D08; text-align: center;">Password Reset</h2>
            <p>Hello,</p>
            <p>You requested a password reset for your JobPortal account. Please click the button below to proceed:</p>
            <p style="color: #e53e3e; font-size: 14px;"><strong>Note: This link is only valid for 15 minutes.</strong></p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${options.resetUrl}" style="background-color: #5F9D08; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #777;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #5F9D08;">${options.resetUrl}</p>
            <hr style="border: none; border-top: 1px solid #eee;">
            <p style="font-size: 10px; color: #aaa; text-align: center;">If you did not request this, please ignore this email.</p>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};