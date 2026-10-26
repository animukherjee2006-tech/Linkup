const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }

})

const sendOTPEmail = async (email,username,otp) =>{
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Registration Verification OTP',
        text: `Hello ${username}, your verification OTP is: ${otp}. It will expire in 5 minutes.`
    }

    return await transporter.sendMail(mailOptions);
}

module.exports = sendOTPEmail