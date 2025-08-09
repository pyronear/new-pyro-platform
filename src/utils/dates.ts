import moment from 'moment-timezone';

const CAMERA_INACTIVITY_THRESHOLD_MINUTES = import.meta.env
  .VITE_CAMERA_INACTIVITY_THRESHOLD_MINUTES;

const FORMAT_DISPLAY_DATETIME = 'DD/MM/YYYY HH:mm:ss';
const FORMAT_DISPLAY_DATE = 'DD/MM/YYYY';
const FORMAT_DISPLAY_TIME = 'HH:mm:ss';

const convertStrToMomentWithUserTimezone = (dateStr: string) => {
  const dateMoment = moment.utc(dateStr);
  dateMoment.tz(moment.tz.guess());
  return dateMoment;
};

const convertNbToMomentWithUserTimezone = (dateNb: number) => {
  const dateMoment = moment(dateNb);
  dateMoment.tz(moment.tz.guess());
  return dateMoment;
};

export const isCameraActive = (lastContactDateStr: string | null) => {
  return isDateWithinTheLastXMinutes(
    lastContactDateStr,
    CAMERA_INACTIVITY_THRESHOLD_MINUTES
  );
};

export const isDateWithinTheLastXMinutes = (
  dateStr: string | null,
  numberOfMinutes: number
) => {
  if (!dateStr) {
    return false;
  }
  const lastContactDate = moment.utc(dateStr);
  const limitDate = moment.utc().subtract(numberOfMinutes, 'minutes');
  return lastContactDate.isAfter(limitDate);
};

export const formatToDateTime = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }

  return convertStrToMomentWithUserTimezone(dateStr).format(
    FORMAT_DISPLAY_DATETIME
  );
};

export const formatNbToTime = (dateNb: number) => {
  return convertNbToMomentWithUserTimezone(dateNb).format(FORMAT_DISPLAY_TIME);
};

export const formatToDate = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }
  return convertStrToMomentWithUserTimezone(dateStr).format(
    FORMAT_DISPLAY_DATE
  );
};

export const formatToTime = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }
  return convertStrToMomentWithUserTimezone(dateStr).format(
    FORMAT_DISPLAY_TIME
  );
};

export const convertStrToEpoch = (dateStr: string) => {
  return convertStrToMomentWithUserTimezone(dateStr).unix();
};

export const isStrictlyAfter = (date1: string, date2: string) => {
  const moment1 = convertStrToMomentWithUserTimezone(date1);
  const moment2 = convertStrToMomentWithUserTimezone(date2);
  return moment1.isBefore(moment2);
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

  const now = moment.utc(moment());
  const pastDate = moment.utc(pastDateString);
  const differenceInMs = Math.abs(now.valueOf() - pastDate.valueOf());

  const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days !== 0) return days === 1 ? `1 ${t('day')}` : `${days} ${t('days')}`;

  if (hours !== 0)
    return hours === 1 ? `1 ${t('hour')}` : `${hours} ${t('hours')}`;

  if (minutes !== 0)
    return minutes === 1 ? `1 ${t('minute')}` : `${minutes} ${t('minutes')}`;

  return t('now');
};

const formatDigit = (n: number) => (n < 10 ? `0${n}` : n);

export const formatTimer = (nbSeconds: number) => {
  const hours = Math.floor(nbSeconds / (60 * 60));
  const minutes = Math.floor((nbSeconds - hours * 60 * 60) / 60);
  const seconds = nbSeconds - hours * 60 * 60 - minutes * 60;
  return `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(seconds)}`;
};
