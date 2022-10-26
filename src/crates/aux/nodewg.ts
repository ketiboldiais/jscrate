import { wgnode } from "@type";

export function nodewg(node?: any, weight: number = 0): wgnode {
  return { node, weight };
}
