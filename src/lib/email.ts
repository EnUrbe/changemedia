import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Attachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Attachment[];
}

export async function sendEmail({ to, subject, text, html, attachments }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Skipping email send.");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CHANGE Media <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content),
      })),
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Message sent: %s", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
