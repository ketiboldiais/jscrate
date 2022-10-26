import { trienode } from "@type";

export function nodetrie(val: string): trienode {
  return { char: val, kids: [], eow: false };
}
