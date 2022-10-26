import { DList } from "@crates";
import { Print } from "@util";

const list = DList(1, 2, 3, 4, 5);

Print(list);

const x = list.get(-1);

Print(x);
