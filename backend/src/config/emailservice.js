

const sendOTPEmail = async (email, otp) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: "Linkup",
                    email: "animukherjee2006@gmail.com" 
                },
                to: [{ email: email }],
                subject: "Verify your email - Linkup",
                htmlContent: `<p>Your verification code is: <strong>${otp}</strong></p>`
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email via Brevo');
        }

        console.log('OTP email sent successfully via Brevo');
    } catch (error) {
        console.error('OTP email error:', error);
        throw error;
    }
};

module.exports = sendOTPEmail