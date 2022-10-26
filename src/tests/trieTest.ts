import { Trie } from "@crates";
import { Print } from "@util";

const trie = Trie("Billy", "Joe", "Cathy", "Hikari");

Print(trie);

trie.delete("Hikari");

Print(trie);



