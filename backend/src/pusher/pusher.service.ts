import { Injectable } from '@nestjs/common';
import PushNotifications from '@pusher/push-notifications-server';

@Injectable()
export class PusherService {
  private beamsClient: PushNotifications;

  constructor() {
    this.beamsClient = new PushNotifications({
      instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID || '',
      secretKey: process.env.PUSHER_BEAMS_SECRET_KEY || '',
    });
  }

  // Trigger a push notification when a new reviewer signs up
  async notifyNewReviewerRequest(user: { fullName: string; email: string; userId: string }) {
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
}
