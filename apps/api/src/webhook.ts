import crypto from 'node:crypto';
import {
  WebhookEventType,
  WebhookSubscription,
  WebhookPayload,
  WebhookDeliveryRecord,
} from '@school-cms/shared';

/**
 * Generates an HMAC SHA-256 signature for the given payload string
 */
export function generateHmacSignature(payloadString: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payloadString, 'utf8').digest('hex');
}

/**
 * Verifies an incoming webhook signature using constant-time comparison
 */
export function verifyHmacSignature(payloadString: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expected = generateHmacSignature(payloadString, secret);
    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(signature, 'hex');
    if (expectedBuffer.length !== receivedBuffer.length) return false;
    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch {
    return false;
  }
}

/**
 * Default seeded webhook subscriptions
 */
export const initialWebhooks: WebhookSubscription[] = [
  {
    id: 'wh-crm-01',
    name: 'Alpha Hub Enterprise CRM Webhook',
    url: 'https://crm.alphaschool.edu.vn/api/v1/leads',
    secret: 'whsec_alpha_crm_2025_prod_key',
    events: ['lead.created', 'lead.status_updated'],
    isActive: true,
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    id: 'wh-slack-02',
    name: 'Admissions Admissions Realtime Alert',
    url: 'https://hooks.slack.com/services/alpha/admissions-alert',
    secret: 'whsec_slack_notif_admissions_key',
    events: ['lead.created'],
    isActive: true,
    createdAt: '2025-02-01T09:30:00.000Z',
  },
];

let webhooksStore: WebhookSubscription[] = [...initialWebhooks];
let deliveryLogsStore: WebhookDeliveryRecord[] = [];

export function getWebhooks(): WebhookSubscription[] {
  return webhooksStore;
}

export function createWebhook(sub: Omit<WebhookSubscription, 'id' | 'createdAt'>): WebhookSubscription {
  const newSub: WebhookSubscription = {
    ...sub,
    id: `wh-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  webhooksStore.push(newSub);
  return newSub;
}

export function deleteWebhook(id: string): boolean {
  const initialLen = webhooksStore.length;
  webhooksStore = webhooksStore.filter((w) => w.id !== id);
  return webhooksStore.length < initialLen;
}

export function getDeliveryLogs(): WebhookDeliveryRecord[] {
  return deliveryLogsStore;
}

/**
 * Dispatches an event to all matching active webhook subscriptions
 */
export function dispatchWebhookEvent<T = any>(event: WebhookEventType, data: T) {
  const payload: WebhookPayload<T> = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  const payloadString = JSON.stringify(payload);
  const matched = webhooksStore.filter((w) => w.isActive && w.events.includes(event));

  const deliveries: WebhookDeliveryRecord[] = matched.map((sub) => {
    const signature = generateHmacSignature(payloadString, sub.secret);
    const delivery: WebhookDeliveryRecord = {
      id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      subscriptionId: sub.id,
      event,
      url: sub.url,
      status: 'SUCCESS', // In simulation/production dispatcher, this marks queued/dispatched
      statusCode: 200,
      attempts: 1,
      timestamp: payload.timestamp,
    };
    deliveryLogsStore.unshift(delivery);
    return delivery;
  });

  return {
    payload,
    deliveriesDispatched: deliveries.length,
    deliveries,
  };
}
