import { Print } from "@util";

/**
 * @description
 * Computes the load factor for
 * a hash table. The closer the load
 * factor is to 1, the more likely it
 * is for a collision to occur. The
 * closer the load factor is to 0,
 * the less likely it is
 * for a collision to occur.
 * @param {number} entries
 * The number of entries in
 * the hash table.
 * @param {number} slots
 * The number of unoccupied
 * and available spaces
 * in the hash table (e.g.,
 * array indices)
 * @returns {number}
 */
export function loadFactor(entries: number, slots: number): number {
  return entries / slots;
}
