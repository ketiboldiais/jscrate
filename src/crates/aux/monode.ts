import { node } from "../../types";

export function monode(value: any): node {
  return { value, next: null };
}
