export function round(number) {
  return Math.round(number * 100 + Number.EPSILON) / 100;
}
