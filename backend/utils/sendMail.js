import axios from "axios";

const sendMail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "HRMS",
          email: process.env.SENDER_EMAIL,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Mail sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("Brevo Error:");
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
    throw err;
  }
};

export default sendMail;