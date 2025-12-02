import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSmsOtp = async (phone, otp) => {
  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
    body: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  });
};
