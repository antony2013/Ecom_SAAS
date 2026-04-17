// Email Processor - BullMQ worker that processes email jobs from the queue
import type { Job } from 'bullmq';
import type { EmailService } from './email.service.js';

export interface EmailJobData {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export function createEmailProcessor(emailService: EmailService) {
  return async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
    await emailService.processEmail({
      to: job.data.to,
      subject: job.data.subject,
      html: job.data.html,
      text: job.data.text,
    });
  };
}