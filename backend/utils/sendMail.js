import transporter from "./nodemailer.js";
const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `HRMS <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    html,
  });
};
export default sendMail;