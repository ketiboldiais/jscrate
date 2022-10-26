import { PriorityNode } from "@type";

export function pnode(value: any, priority: number): PriorityNode {
  return { value, priority };
}
