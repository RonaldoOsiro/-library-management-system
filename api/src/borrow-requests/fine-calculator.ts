const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function calculateFine(
  dueDate: Date,
  returnDate: Date,
  ratePerDay: number,
): number {
  const dueTime = dueDate.getTime();
  const returnTime = returnDate.getTime();

  if (!Number.isFinite(dueTime) || !Number.isFinite(returnTime)) {
    throw new TypeError('Due date and return date must be valid dates');
  }
  if (!Number.isFinite(ratePerDay) || ratePerDay < 0) {
    throw new RangeError('Rate per day must be a non-negative number');
  }

  const overdueDays = Math.max(
    0,
    Math.ceil((returnTime - dueTime) / MILLISECONDS_PER_DAY),
  );
  return Math.round(overdueDays * ratePerDay * 100) / 100;
}
