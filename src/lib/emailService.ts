/**
 * Goshen Clothing - Email Service
 * Centralized service for sending emails (2FA, Transactional, etc.)
 */

export class EmailService {
    /**
     * Sends a 2FA PIN to the user's email.
     * @param email The recipient's email address
     * @param pin The 4-digit PIN
     */
    static async send2FAPin(email: string, pin: string): Promise<boolean> {
        // PRODUCTION: Integrate with Resend, SendGrid, or AWS SES here
        // example: await resend.emails.send({ ... })

        console.log(`
==================================================
[EMAIL SERVICE] Sending 2FA PIN
To: ${email}
PIN: ${pin}
Time: ${new Date().toLocaleString()}
==================================================
        `);

        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));

        return true;
    }

    /**
     * Sends a welcome email or other notification
     */
    static async sendNotification(email: string, subject: string, body: string): Promise<boolean> {
        console.log(`[EMAIL SERVICE] Notification to ${email}: ${subject}`);
        return true;
    }
}
