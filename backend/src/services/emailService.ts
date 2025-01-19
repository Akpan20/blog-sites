import nodemailer from 'nodemailer';

interface Subscriber {
  email: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
}

class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service (you can use others like SMTP)
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
  });

  static async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM environment variable is not set');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  static async sendNewPostNotification(subscribers: Subscriber[], post: Post): Promise<void> {
    const template = `
      <h2>New Post: ${post.title}</h2>
      <p>${post.excerpt}</p>
      <a href="${process.env.SITE_URL}/posts/${post.id}">Read More</a>
    `;

    for (const subscriber of subscribers) {
      await this.sendEmail(
        subscriber.email,
        `New Post: ${post.title}`,
        template
      );
    }
  }
}

export default EmailService;
