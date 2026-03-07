const RESEND_API_KEY = "re_RYA62gSh_7QCfDEBGobfG2KjE4qmkh6MJ";

export const sendResetEmail = async (email: string, resetLink: string, isNewUser: boolean) => {
    const subject =  "Reset Your Password - Web3 Derp";
    const body = `
    <h1> "Password Reset Request"</h1>
    <p>Please click the link below to set your password and activate your account</p>
    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 5px;">
      Set Password
    </a>
    <p>Or copy and paste this link: ${resetLink}</p>
  `;

    try {
        // Note: This call may fail due to CORS if run directly from the browser.
        // In a production app, this should be handled by a proxy or serverless function.
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Web3 Derp <onboarding@resend.dev>",
                to: [email],
                subject: subject,
                html: body,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send email");
        }

        return await response.json();
    } catch (error) {
        console.error("Resend error:", error);
        throw error;
    }
};
