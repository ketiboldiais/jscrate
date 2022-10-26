import { Graph } from "@crates";
import { Print } from "@util";

const g = Graph(
  ["LA", "Chicago"],
  ["Atlanta", "Chicago"],
  ["LA", "Atlanta"],
);

Print(g.complete());

