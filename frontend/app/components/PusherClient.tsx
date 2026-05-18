'use client';

import { useEffect, useState } from 'react';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

export default function PusherClient() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initPusher = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        
        const user = JSON.parse(storedUser);
        if (!user.userId) return;

        setUserId(user.userId);

        const beamsClient = new PusherPushNotifications.Client({
          instanceId: '2756b620-9ee3-4c23-b42c-f1eda8ec119c',
        });

        const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
          url: 'http://localhost:3000/reviewer/pusher/beams-auth',
        });

        await beamsClient.start();
        await beamsClient.setUserId(user.userId, beamsTokenProvider);
        console.log('Successfully registered with Pusher Beams and subscribed to user ID:', user.userId);
        setIsSubscribed(true);
      } catch (err) {
        console.error('Pusher Beams initialization failed:', err);
      }
    };

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      initPusher();
    }
  }, []);

  const handleTestPush = async () => {
    if (!userId) return;
    try {
      await fetch('http://localhost:3000/reviewer/pusher/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch (err) {
      console.error('Failed to send test push', err);
    }
  };

  if (!isSubscribed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={handleTestPush}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-xl text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105"
      >
        <span>🔔</span> Test Push Notification
      </button>
    </div>
  );
}
