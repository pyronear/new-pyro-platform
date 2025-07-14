import moment from 'moment-timezone';

const CAMERA_INACTIVITY_THRESHOLD_MINUTES = import.meta.env
  .VITE_CAMERA_INACTIVITY_THRESHOLD_MINUTES;

const FORMAT_DISPLAY_DATETIME = 'DD/MM/YYYY HH:mm:ss';

const convertStrToMomentWithUserTimezone = (dateStr: string) => {
  const dateMoment = moment.utc(dateStr);
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
