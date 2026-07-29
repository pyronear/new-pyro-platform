export const buildArrayAroundCenter = (
  step: number,
  center: number,
  maxRange: number
) => {
  const nbItemsOnOneSide = Math.trunc(maxRange / 2 / step);
  const array = [center];
  for (let i = 1; i <= nbItemsOnOneSide; i += 1) {
    array.push(center - i * step);
    array.push(center + i * step);
  }
  array.sort((a, b) => a - b);
  return array;
};

export const isFirstOrLastInList = (list: number[], index: number) => {
  return index === 0 || index === list.length - 1;
};

export const isMiddleInList = (list: number[], index: number) => {
  const hasCenter = list.length % 2 === 1;
  return hasCenter && index === Math.floor(list.length / 2);
};
