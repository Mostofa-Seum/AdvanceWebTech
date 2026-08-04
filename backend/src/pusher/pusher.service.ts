import { Injectable } from '@nestjs/common';
import PushNotifications from '@pusher/push-notifications-server';

@Injectable()
export class PusherService {
  private beamsClient: PushNotifications | null = null;

  constructor() {
    const instanceId = process.env.PUSHER_BEAMS_INSTANCE_ID;
    const secretKey = process.env.PUSHER_BEAMS_SECRET_KEY;
    if (instanceId && secretKey) {
      try {
        this.beamsClient = new PushNotifications({
          instanceId,
          secretKey,
        });
      } catch (err) {
        console.error('Failed to initialize Pusher Beams:', err);
      }
    } else {
      console.log('Pusher Beams credentials not found. Notifications disabled.');
    }
  }

  // Trigger a push notification when a new reviewer signs up
  async notifyNewReviewerRequest(user: { fullName: string; email: string; userId: string }) {
    if (!this.beamsClient) return;
    try {
      await this.beamsClient.publishToInterests(['admin-notifications'], {
        web: {
          notification: {
            title: '🔔 New Reviewer Request',
            body: `${user.fullName} (${user.email}) wants to join as a reviewer`,
            deep_link: 'http://localhost:5000/admin/dashboard',
          },
        },
      });
      console.log(`Pusher Beams: Notified admin about new reviewer request from ${user.fullName}`);
    } catch (err) {
      console.error('Pusher Beams notification failed:', err);
    }
  }

  // Trigger a push notification when admin accepts/rejects a reviewer
  async notifyReviewerDecision(user: { fullName: string; email: string; userId: string }, action: 'accepted' | 'rejected') {
    if (!this.beamsClient) return;
    try {
      await this.beamsClient.publishToInterests(['admin-notifications'], {
        web: {
          notification: {
            title: action === 'accepted' ? '✅ Reviewer Accepted' : '❌ Reviewer Rejected',
            body: `${user.fullName} has been ${action}`,
            deep_link: 'http://localhost:5000/admin/dashboard',
          },
        },
      });
      console.log(`Pusher Beams: Reviewer ${user.fullName} has been ${action}`);
    } catch (err) {
      console.error('Pusher Beams notification failed:', err);
    }
  }

  // Trigger a push notification to Reviewers when a new Company or Employee signs up
  async notifyNewRegistrationToReviewers(user: { fullName: string; email: string; role: string }) {
    if (!this.beamsClient) return;
    try {
      await this.beamsClient.publishToInterests(['reviewer-notifications'], {
        web: {
          notification: {
            title: `🔔 New ${user.role} Registered`,
            body: `${user.fullName} (${user.email}) has signed up as a ${user.role} and needs verification.`,
            deep_link: 'http://localhost:5000/reviewer_dashboard',
          },
        },
      });
      console.log(`Pusher Beams: Notified reviewers about new ${user.role} registration from ${user.fullName}`);
    } catch (err) {
      console.error('Pusher Beams notification failed:', err);
    }
  }

  // Trigger a push notification to a Company user (application received, work submitted, etc.)
  async notifyCompany(title: string, body: string) {
    if (!this.beamsClient) return;
    try {
      await this.beamsClient.publishToInterests(['company-notifications'], {
        web: {
          notification: {
            title,
            body,
            deep_link: 'http://localhost:3001/company',
          },
        },
      });
    } catch (err) {
      console.error('Pusher Beams (company) notification failed:', err);
    }
  }

  // Trigger a push notification to an Employee user (application accepted, payment released, etc.)
  async notifyEmployee(title: string, body: string) {
    if (!this.beamsClient) return;
    try {
      await this.beamsClient.publishToInterests(['employee-notifications'], {
        web: {
          notification: {
            title,
            body,
            deep_link: 'http://localhost:3001/employee',
          },
        },
      });
    } catch (err) {
      console.error('Pusher Beams (employee) notification failed:', err);
    }
  }

  // Trigger a push notification to Reviewers about new work to verify
  async notifyReviewers(title: string, body: string) {
    if (!this.beamsClient) return;
    try {
      await this.beamsClient.publishToInterests(['reviewer-notifications'], {
        web: {
          notification: {
            title,
            body,
            deep_link: 'http://localhost:5000/reviewer_dashboard/work_verifications',
          },
        },
      });
    } catch (err) {
      console.error('Pusher Beams (reviewer) notification failed:', err);
    }
  }
}
