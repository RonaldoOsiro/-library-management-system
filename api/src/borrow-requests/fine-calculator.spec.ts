import { calculateFine } from './fine-calculator';

describe('calculateFine', () => {
  const dueDate = new Date('2026-01-15T12:00:00.000Z');

  it('returns no fine when the book is returned on time', () => {
    expect(calculateFine(dueDate, dueDate, 1.5)).toBe(0);
    expect(
      calculateFine(dueDate, new Date('2026-01-15T11:59:00.000Z'), 1.5),
    ).toBe(0);
  });

  it('charges each overdue day, rounding a partial day up', () => {
    expect(
      calculateFine(dueDate, new Date('2026-01-17T12:01:00.000Z'), 1.5),
    ).toBe(4.5);
  });
});
