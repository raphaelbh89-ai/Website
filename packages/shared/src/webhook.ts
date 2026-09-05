export type WebhookEventType =
  | 'lead.created'
  | 'lead.status_updated'
  | 'page.published'
  | 'system.alert'
  | 'admission.submitted'
  | 'admission.status_changed'
  | 'admission.enrolled'
  | 'payment.created'
  | 'payment.success'
  | 'payment.manual_confirmed';

export interface WebhookSubscription {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
  createdAt: string;
}

export interface WebhookPayload<T = any> {
  id: string;
  event: WebhookEventType;
  timestamp: string;
  data: T;
}

export interface WebhookDeliveryRecord {
  id: string;
  subscriptionId: string;
  event: WebhookEventType;
  url: string;
  status: 'SUCCESS' | 'FAILED' | 'QUEUED';
  statusCode?: number;
  attempts: number;
  timestamp: string;
}
