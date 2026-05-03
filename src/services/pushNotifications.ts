import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { apiInstance } from './axios';

const vapidPublicKeyResponseSchema = z.object({
  public_key: z.string(),
});

const pushSubscriptionResponseSchema = z.object({
  id: z.number(),
  endpoint: z.string(),
  expiration_time: z.nullable(z.iso.datetime({ offset: true })),
  user_agent: z.nullable(z.string()),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
});

const pushSubscriptionKeysSchema = z.object({
  auth: z.string(),
  p256dh: z.string(),
});

const pushSubscriptionPayloadSchema = z.object({
  endpoint: z.string(),
  keys: pushSubscriptionKeysSchema,
  expiration_time: z.string().nullable(),
  user_agent: z.string().nullable(),
});

export type BrowserPushSubscriptionDto = z.infer<
  typeof pushSubscriptionResponseSchema
>;
export type BrowserPushSubscriptionPayload = z.infer<
  typeof pushSubscriptionPayloadSchema
>;

const SERVICE_WORKER_PATH = '/push-notifications-sw.js';

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const isBrowserPushSupported = (): boolean => {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
};

export const getBrowserPushPermission = ():
  | NotificationPermission
  | 'unsupported' => {
  if (!isBrowserPushSupported()) {
    return 'unsupported';
  }

  return Notification.permission;
};

export const registerPushServiceWorker =
  async (): Promise<ServiceWorkerRegistration> => {
    return navigator.serviceWorker.register(SERVICE_WORKER_PATH);
  };

export const getCurrentBrowserPushSubscription =
  async (): Promise<PushSubscription | null> => {
    if (!isBrowserPushSupported()) {
      return null;
    }

    const registration = await registerPushServiceWorker();
    return registration.pushManager.getSubscription();
  };

const serializeBrowserPushSubscription = (
  subscription: PushSubscription
): BrowserPushSubscriptionPayload => {
  const subscriptionJson = subscription.toJSON();

  if (
    !subscriptionJson.endpoint ||
    !subscriptionJson.keys?.auth ||
    !subscriptionJson.keys.p256dh
  ) {
    throw new Error('INVALID_PUSH_SUBSCRIPTION');
  }

  return pushSubscriptionPayloadSchema.parse({
    endpoint: subscriptionJson.endpoint,
    keys: {
      auth: subscriptionJson.keys.auth,
      p256dh: subscriptionJson.keys.p256dh,
    },
    expiration_time:
      typeof subscriptionJson.expirationTime === 'number'
        ? new Date(subscriptionJson.expirationTime).toISOString()
        : null,
    user_agent: navigator.userAgent,
  });
};

export const fetchBrowserPushPublicKey = async (): Promise<string> => {
  return apiInstance
    .get('/api/v1/push-subscriptions/public-key')
    .then((response: AxiosResponse) => {
      const result = vapidPublicKeyResponseSchema.safeParse(response.data);
      if (!result.success) {
        throw new Error('INVALID_API_RESPONSE');
      }
      return result.data.public_key;
    })
    .catch((error: unknown) => {
      console.error(error);
      throw error;
    });
};

export const fetchBrowserPushSubscriptions = async (): Promise<
  BrowserPushSubscriptionDto[]
> => {
  return apiInstance
    .get('/api/v1/push-subscriptions/')
    .then((response: AxiosResponse) => {
      const result = z
        .array(pushSubscriptionResponseSchema)
        .safeParse(response.data);
      if (!result.success) {
        throw new Error('INVALID_API_RESPONSE');
      }
      return result.data;
    })
    .catch((error: unknown) => {
      console.error(error);
      throw error;
    });
};

export const upsertBrowserPushSubscription = async (
  payload: BrowserPushSubscriptionPayload
): Promise<BrowserPushSubscriptionDto> => {
  return apiInstance
    .post('/api/v1/push-subscriptions/', payload)
    .then((response: AxiosResponse) => {
      const result = pushSubscriptionResponseSchema.safeParse(response.data);
      if (!result.success) {
        throw new Error('INVALID_API_RESPONSE');
      }
      return result.data;
    })
    .catch((error: unknown) => {
      console.error(error);
      throw error;
    });
};

export const deleteBrowserPushSubscription = async (
  subscriptionId: number
): Promise<void> => {
  return apiInstance
    .delete(`/api/v1/push-subscriptions/${subscriptionId.toString()}`)
    .then(() => undefined)
    .catch((error: unknown) => {
      console.error(error);
      throw error;
    });
};

const getApplicationServerKey = async (): Promise<BufferSource> => {
  return urlBase64ToUint8Array(
    await fetchBrowserPushPublicKey()
  ) as unknown as BufferSource;
};

export const subscribeCurrentBrowserDevice = async (): Promise<void> => {
  if (!isBrowserPushSupported()) {
    throw new Error('PUSH_NOT_SUPPORTED');
  }

  const permission = await Notification.requestPermission();
  if (permission === 'denied') {
    throw new Error('NOTIFICATION_PERMISSION_DENIED');
  }
  if (permission !== 'granted') {
    throw new Error('NOTIFICATION_PERMISSION_DISMISSED');
  }

  const registration = await registerPushServiceWorker();
  const existingSubscription = await registration.pushManager.getSubscription();
  const subscription =
    existingSubscription ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: await getApplicationServerKey(),
    }));

  await upsertBrowserPushSubscription(
    serializeBrowserPushSubscription(subscription)
  );
};

export const syncExistingBrowserPushSubscription = async (): Promise<void> => {
  if (!isBrowserPushSupported() || Notification.permission !== 'granted') {
    return;
  }

  const subscription = await getCurrentBrowserPushSubscription();
  if (!subscription) {
    return;
  }

  await upsertBrowserPushSubscription(
    serializeBrowserPushSubscription(subscription)
  );
};

export const unsubscribeCurrentBrowserDevice = async (): Promise<void> => {
  if (!isBrowserPushSupported()) {
    return;
  }

  const subscription = await getCurrentBrowserPushSubscription();
  if (!subscription) {
    return;
  }

  const subscriptions = await fetchBrowserPushSubscriptions();
  const matchingSubscriptions = subscriptions.filter(
    (entry) => entry.endpoint === subscription.endpoint
  );

  await Promise.all(
    matchingSubscriptions.map((entry) =>
      deleteBrowserPushSubscription(entry.id)
    )
  );
  await subscription.unsubscribe();
};
