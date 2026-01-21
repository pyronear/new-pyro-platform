import { DateTime, Duration } from 'luxon';

import appConfig from '@/services/appConfig';

const CAMERAS_INACTIVITY_THRESHOLD_MINUTES =
  appConfig.getConfig().CAMERAS_INACTIVITY_THRESHOLD_MINUTES;

const FORMAT_DISPLAY_DATETIME = 'dd/MM/yyyy HH:mm:ss';
const FORMAT_DISPLAY_DATE = 'dd/MM/yyyy';
const FORMAT_DISPLAY_TIME = 'HH:mm:ss';

const isoToDatetime = (dateStr: string) => {
  const dateMoment = DateTime.fromISO(dateStr, { zone: 'utc' });
  return dateMoment.setZone('local');
};

const unixToDatetime = (dateNb: number) => {
  const dateMoment = DateTime.fromMillis(dateNb, { zone: 'utc' });
  return dateMoment.setZone('local');
};

export const isCameraActive = (lastContactDateStr: string | null) => {
  return isDateWithinTheLastXMinutes(
    lastContactDateStr,
    CAMERAS_INACTIVITY_THRESHOLD_MINUTES
  );
};

export const isDateWithinTheLastXMinutes = (
  dateStr: string | null,
  numberOfMinutes: number
) => {
  if (!dateStr) {
    return false;
  }
  const lastContactDate = DateTime.fromISO(dateStr, { zone: 'utc' });
  const limitDate = DateTime.now().minus({ minute: numberOfMinutes });
  return lastContactDate > limitDate;
};

export const getNowMinusOneYear = (): DateTime => {
  return DateTime.now().minus({ year: 1 });
};

export const formatIsoToDateTime = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }
  return isoToDatetime(dateStr).toFormat(FORMAT_DISPLAY_DATETIME);
};

export const formatIsoToDate = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }
  return isoToDatetime(dateStr).toFormat(FORMAT_DISPLAY_DATE);
};

export const formatIsoToTime = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }
  return isoToDatetime(dateStr).toFormat(FORMAT_DISPLAY_TIME);
};

export const formatDateToApi = (date: DateTime) => {
  return date.toFormat('yyyy-MM-dd');
};

export const formatUnixToTime = (dateNb: number) => {
  const date = unixToDatetime(dateNb);
  return date.toFormat(FORMAT_DISPLAY_TIME);
};

export const convertIsoToUnix = (dateStr: string) => {
  return isoToDatetime(dateStr).toUnixInteger();
};

export const isStrictlyAfter = (date1: string, date2: string) => {
  return isoToDatetime(date1) < isoToDatetime(date2);
};

interface FormatTimeAgoProps {
  pastDateString: string | null;
  translationFunction: (key: string) => string;
}

export const formatTimeAgo = ({
  pastDateString,
  translationFunction: t,
}: FormatTimeAgoProps): string => {
  if (pastDateString === null) {
    return '';
  }
  const pastDate = DateTime.fromISO(pastDateString, { zone: 'utc' });
  const difference = DateTime.now().diff(pastDate, [
    'days',
    'hours',
    'minutes',
  ]);

  const days = difference.days;
  const hours = difference.hours;
  const minutes = Math.floor(difference.minutes);

  if (days !== 0) return days === 1 ? `1 ${t('day')}` : `${days} ${t('days')}`;

  if (hours !== 0)
    return hours === 1 ? `1 ${t('hour')}` : `${hours} ${t('hours')}`;

  if (minutes !== 0)
    return minutes === 1 ? `1 ${t('minute')}` : `${minutes} ${t('minutes')}`;

  return t('now');
};

export const formatTimer = (nbSeconds: number) => {
  const duration = Duration.fromMillis(nbSeconds * 1000);
  return duration.toFormat('hh:mm:ss');
};
