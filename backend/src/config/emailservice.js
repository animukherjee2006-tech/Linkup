const sendOTPEmail = async (email, username, otp) => {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        throw new Error('BREVO_API_KEY is missing in environment variables');
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: "Linkup",
                    email: "animukherjee2006@gmail.com" // Apni verified Brevo sender email yahan dalein
                },
                to: [{ email: email }],
                subject: "Verification Code - Linkup",
                htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${username || 'User'},</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #2563eb; letter-spacing: 4px;">${otp}</h1>
                    <p>This code is valid for 5 minutes.</p>
                </div>`
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

module.exports = sendOTPEmail;