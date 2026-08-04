import { Injectable } from '@nestjs/common';

@Injectable()
export class PusherService {
  constructor() {
    console.log('PusherService (Mock) initialized.');
  }

  async notifyNewReviewerRequest(user: { fullName: string; email: string; userId: string }) {
    console.log(`Pusher Service (Mock): notifyNewReviewerRequest - ${user.fullName}`);
  }

  async notifyReviewerDecision(user: { fullName: string; email: string; userId: string }, action: 'accepted' | 'rejected') {
    console.log(`Pusher Service (Mock): notifyReviewerDecision - ${user.fullName} is ${action}`);
  }

  async notifyNewRegistrationToReviewers(user: { fullName: string; email: string; role: string }) {
    console.log(`Pusher Service (Mock): notifyNewRegistrationToReviewers - ${user.fullName} (${user.role})`);
  }

  async notifyCompany(title: string, body: string) {
    console.log(`Pusher Service (Mock): notifyCompany - ${title}: ${body}`);
  }

  async notifyEmployee(title: string, body: string) {
    console.log(`Pusher Service (Mock): notifyEmployee - ${title}: ${body}`);
  }

  async notifyReviewers(title: string, body: string) {
    console.log(`Pusher Service (Mock): notifyReviewers - ${title}: ${body}`);
  }
}
