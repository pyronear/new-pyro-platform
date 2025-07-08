import moment from 'moment';

const CAMERA_INACTIVITY_THRESHOLD_MINUTES = import.meta.env
  .VITE_CAMERA_INACTIVITY_THRESHOLD_MINUTES;

const FORMAT_DISPLAY_DATETIME = 'DD/MM/YYYY HH:mm:ss';

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
  const lastContactDate = moment(dateStr);
  const limitDate = moment().subtract(numberOfMinutes, 'minutes');
  return lastContactDate.isAfter(limitDate);
};

export const formatToDateTime = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }
  return moment(dateStr).format(FORMAT_DISPLAY_DATETIME);
};
