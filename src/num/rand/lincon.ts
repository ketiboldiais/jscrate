/**
 * @description
 * Generates an array of random integers between
 * 0 and m using linear congruence, namely
 * the recurrence:
 *
 *   X_(n+1) = (aX_n + b) mod m
 *
 * @param {number} m
 * The end point of the range of output
 * numbers (also called the modulus).
 * Since all X_(n+1) will be less than m, the
 * numbers in the range [0,m] will repeat.
 * To ensure the period for repetition is as large
 * as possible (this ensures that the generated array
 * is close to including all integers less than m,
 * with array's elements close to uniform distribution).
 * @param {number} a
 * Some constant integer.
 * @param {number} b
 * Some constant integer.
 *
 */

// export function lincon(m: number, a: number = 16807, b: number = 0): number[] {}
