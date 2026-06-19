import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/context/useAuth';
import {
  getBrowserPushPermission,
  getCurrentBrowserPushSubscription,
  isBrowserPushSupported,
  subscribeCurrentBrowserDevice,
  unsubscribeCurrentBrowserDevice,
} from '@/services/pushNotifications';

type BrowserPushErrorCode =
  | 'UNAVAILABLE'
  | 'DENIED'
  | 'DISMISSED'
  | 'UNKNOWN'
  | null;

const getErrorCode = (error: unknown): BrowserPushErrorCode => {
  if (error instanceof AxiosError && error.response?.status === 503) {
    return 'UNAVAILABLE';
  }

  if (
    error instanceof Error &&
    error.message === 'NOTIFICATION_PERMISSION_DENIED'
  ) {
    return 'DENIED';
  }

  if (
    error instanceof Error &&
    error.message === 'NOTIFICATION_PERMISSION_DISMISSED'
  ) {
    return 'DISMISSED';
  }

  return 'UNKNOWN';
};

export const BrowserPushNotificationsSection: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<
    NotificationPermission | 'unsupported'
  >(() => getBrowserPushPermission());
  const [errorCode, setErrorCode] = useState<BrowserPushErrorCode>(null);

  const refreshState = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (!isBrowserPushSupported()) {
      setPermission('unsupported');
      setIsSubscribed(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const subscription = await getCurrentBrowserPushSubscription();
      setPermission(Notification.permission);
      setIsSubscribed(subscription !== null);
      setErrorCode(null);
    } catch (error) {
      console.error(error);
      setErrorCode('UNKNOWN');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await subscribeCurrentBrowserDevice();
      setErrorCode(null);
    } catch (error) {
      console.error(error);
      setErrorCode(getErrorCode(error));
    } finally {
      await refreshState();
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await unsubscribeCurrentBrowserDevice();
      setErrorCode(null);
    } catch (error) {
      console.error(error);
      setErrorCode('UNKNOWN');
    } finally {
      await refreshState();
    }
  };

  const getStatusMessage = () => {
    if (permission === 'unsupported') {
      return t('preferences.browserNotifications.unsupported');
    }
    if (permission === 'denied') {
      return t('preferences.browserNotifications.denied');
    }
    if (isSubscribed) {
      return t('preferences.browserNotifications.subscribed');
    }
    return t('preferences.browserNotifications.unsubscribed');
  };

  const getErrorMessage = () => {
    if (errorCode === null) {
      return null;
    }

    switch (errorCode) {
      case 'UNAVAILABLE':
        return t('preferences.browserNotifications.errors.unavailable');
      case 'DENIED':
        return t('preferences.browserNotifications.errors.denied');
      case 'DISMISSED':
        return t('preferences.browserNotifications.errors.dismissed');
      default:
        return t('preferences.browserNotifications.errors.unknown');
    }
  };

  return (
    <Stack spacing={1}>
      <Typography>{t('preferences.browserNotifications.title')}</Typography>
      <Typography variant="body2">{getStatusMessage()}</Typography>
      {getErrorMessage() && (
        <Typography variant="body2" color="error">
          {getErrorMessage()}
        </Typography>
      )}
      {permission !== 'unsupported' && permission !== 'denied' && (
        <Button
          onClick={() =>
            void (isSubscribed ? handleUnsubscribe() : handleSubscribe())
          }
          variant="outlined"
          startIcon={
            isLoading ? (
              <CircularProgress size={16} />
            ) : isSubscribed ? (
              <NotificationsOffIcon />
            ) : (
              <NotificationsActiveIcon />
            )
          }
          disabled={isLoading}
          fullWidth
        >
          {isLoading
            ? t('preferences.browserNotifications.loading')
            : isSubscribed
              ? t('preferences.browserNotifications.disableButton')
              : t('preferences.browserNotifications.enableButton')}
        </Button>
      )}
    </Stack>
  );
};
