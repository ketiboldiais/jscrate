// prettier-ignore
export class INT {
  val: number[];
  len: number;
  constructor(num: string) {
    this.val = [];
    this.len = num.length;
    for (let i = 0; i < this.len; i++) {
      switch (num[i]) {
        case "0": this.val.push(0); break;
        case "1": this.val.push(1); break;
        case "2": this.val.push(2); break;
        case "3": this.val.push(3); break;
        case "4": this.val.push(4); break;
        case "5": this.val.push(5); break;
        case "6": this.val.push(6); break;
        case "7": this.val.push(7); break;
        case "8": this.val.push(8); break;
				case "9": this.val.push(9); break;
				default: this.val.push(0);
      }
    }
  }
  add(N: INT) {
    
  }
	log() {
		let str = "";
		let arr = this.val;
		for (let i = 0; i < arr.length; i++) {
			str += arr[i];
		}
		console.log(str);
		return this;
	}
}

export const int = (s: string) => new INT(s);
