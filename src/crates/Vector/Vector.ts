import { Bitset } from "@crates";
import { Set } from "@crates";
import { max, min, rem } from "@num";

enum vect {
  int8,
  uint8,
  uint8clamped,
  int16,
  uint16,
  int32,
  uint32,
  float32,
  float64,
  bigint64,
  biguint64,
  std,
}

export abstract class VECTOR {
  private count: number;
  private array: any;
  private type: vect;
  private capacity: number;
  constructor(type: vect, nums: any[]) {
    this.type = type;
    this.count = 0;
    this.capacity = 0;
    this.array = this.newarray();
    if (nums.length !== 0) {
      const L = nums.length;
      for (let i = 0; i < L; i++) {
        this.push(nums[i]);
      }
      return this;
    }
  }
  newarray(size?: number) {
    switch (this.type) {
      case vect.int8:
        return size ? new Int8Array(size) : new Int8Array();
      case vect.uint8:
        return size ? new Uint8Array(size) : new Uint8Array();
      case vect.uint8clamped:
        return size ? new Uint8ClampedArray(size) : new Uint8ClampedArray();
      case vect.int16:
        return size ? new Int16Array(size) : new Int16Array();
      case vect.uint16:
        return size ? new Uint16Array(size) : new Uint16Array();
      case vect.int32:
        return size ? new Int32Array(size) : new Int32Array();
      case vect.uint32:
        return size ? new Uint32Array(size) : new Uint32Array();
      case vect.float32:
        return size ? new Float32Array(size) : new Float32Array();
      case vect.float64:
        return size ? new Float64Array(size) : new Float64Array();
      case vect.bigint64:
        return size ? new BigInt64Array(size) : new BigInt64Array();
      case vect.biguint64:
        return size ? new BigUint64Array(size) : new BigUint64Array();
      default:
        return [] as number[];
    }
  }
  private init(type: vect, array: any[]): any {
    switch (type) {
      case vect.int8:
        return new VECTOR_INT8(...array);
      case vect.uint8:
        return new VECTOR_UINT8(...array);
      case vect.uint8clamped:
        return new VECTOR_UINT8C(...array);
      case vect.int16:
        return new VECTOR_INT16(...array);
      case vect.uint16:
        return new VECTOR_UINT16(...array);
      case vect.int32:
        return new VECTOR_INT32(...array);
      case vect.uint32:
        return new VECTOR_UINT32(...array);
      case vect.float32:
        return new VECTOR_FLOAT32(...array);
      case vect.float64:
        return new VECTOR_FLOAT64(...array);
      case vect.bigint64:
        return new VECTOR_BIGINT64(...array);
      case vect.biguint64:
        return new VECTOR_BIGUINT64(...array);
      default:
        return [] as number[];
    }
  }
  maxBandLength() {
    const arrmin = min(this.array);
    const arrmax = max(this.array);
    const maxboolidx = arrmax - arrmin + 1;
    const bitstring = Bitset().fill(0, 0, maxboolidx);
    for (let i = 0; i < this.count; i++) {
      let v = this.array[i] - arrmin;
      bitstring.setBit(v);
    }
    let belt = 0;
    let e: number;
    for (let i = 0; i < maxboolidx; i++) {
      let newbelt = 0;
      e = bitstring.getBit(i);
      while (i < maxboolidx && e === 1) {
        newbelt += 1;
        i++;
        e = bitstring.getBit(i);
      }
      belt = newbelt > belt ? newbelt : belt;
    }
    return belt;
  }
  pairSum(targetSum: any) {
    let seen = Set();
    for (let i = 0; i < this.count; i++) {
      let diff = targetSum - this.array[i];
      if (seen.has(diff)) {
        return this.init(this.type, [diff, this.array[i]]);
      }
      seen.push(this.array[i]);
    }
    return null;
  }
  has(...subarray: any[]) {
    const subarrayLength = subarray.length;
    if (subarrayLength === 0) return 0;
    if (subarrayLength === 1) {
      let i = 0;
      for (; i < this.count; i++) {
        if (this.array[i] === subarray[0]) return i;
      }
      return -1;
    }
    let LPS = [0];
    let prevLPS = 0;
    let i = 1;
    while (i < subarrayLength) {
      if (subarray[i] === subarray[prevLPS]) {
        LPS[i] = prevLPS + 1;
        prevLPS += 1;
        i += 1;
      } else if (prevLPS === 0) {
        LPS[i] = 0;
        i += 1;
      } else prevLPS = LPS[prevLPS - 1];
    }
    i = 0;
    let j = 0;
    while (i < this.count) {
      if (this.array[i] === subarray[j]) {
        i += 1;
        j += 1;
      } else if (j === 0) i += 1;
      else j = LPS[j - 1];
      if (j === subarrayLength) return i - subarrayLength;
    }
    return -1;
  }
  concat(array: VECTOR) {
    const v8 = this.newarray();
    for (let i = 0; i < this.count; ++i) {
      v8[v8.length] = this.array[i];
    }
    for (let i = 0; i < array.count; ++i) {
      v8[v8.length] = array.array[i];
    }
    return v8;
  }
  at(i: number) {
    i = rem(i, this.count);
    return this.array[i];
  }
  set(i: number, val: number) {
    i = rem(i, this.count);
    this.array[i] = val;
  }
  first() {
    return this.array[0];
  }

  last() {
    return this.array[this.count - 1];
  }
  empty() {
    return this.count === 0;
  }
  fit() {
    let n: any = this.newarray(this.count);
    for (let i = 0; i < this.count; i++) {
      n[i] = this.array[i];
    }
    this.array = n;
    n = null;
    return this;
  }
  get length() {
    return this.count;
  }
  push(val: number) {
    if (this.capacity < this.count + 1) {
      let n: any = this.newarray(2 * this.capacity + 1);
      this.capacity = 2 * this.capacity + 1;
      for (let i = 0; i < this.count; ++i) {
        n[i] = this.array[i];
      }
      this.array = n;
      n = null;
    }
    this.array[this.count] = val;
    this.count += 1;
    return this;
  }
  insert(index: number, val: number) {
    index = rem(index, this.count);
    if (this.capacity < this.count + 1) {
      let n: any = this.newarray(2 * this.capacity + 1);
      this.capacity = 2 * this.capacity + 1;
      for (let i = 0; i < this.count; ++i) {
        n[i] = this.array[i];
      }
      this.array = n;
      n = null;
    }
    for (let i = this.count; i > index; i--) {
      this.array[i] = this.array[i - 1];
    }
    this.array[index] = val;
    this.count++;
    return this;
  }
  includes(val: number) {
    for (let i = 0; i < this.count; i++) {
      if (this.array[i] === val) return true;
    }
    return false;
  }
  delete(index: number) {
    index = rem(index, this.count);
    let out = this.array[index];
    for (let i = index; i < this.count - 1; ++i) {
      this.array[i] = this.array[i + 1];
    }
    this.count -= 1;
    return out;
  }
  pop() {
    let out = this.array[this.count - 1];
    this.count--;
    return out;
  }
  arrayed() {
    let out: number[] = [];
    if (this.array === null) return out;
    for (let i = 0; i < this.count; ++i) {
      out.push(this.array[i]);
    }
    return out;
  }
}

export class VECTOR_INT8 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.int8, nums);
  }
}
export class VECTOR_STD extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.std, nums);
  }
}
export class VECTOR_UINT8 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.uint8, nums);
  }
}
export class VECTOR_UINT8C extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.uint8clamped, nums);
  }
}
export class VECTOR_INT16 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.int16, nums);
  }
}
export class VECTOR_UINT16 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.uint16, nums);
  }
}
export class VECTOR_INT32 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.int32, nums);
  }
}
export class VECTOR_UINT32 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.uint32, nums);
  }
}
export class VECTOR_FLOAT32 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.float32, nums);
  }
}
export class VECTOR_FLOAT64 extends VECTOR {
  constructor(...nums: number[]) {
    super(vect.float64, nums);
  }
}
export class VECTOR_BIGINT64 extends VECTOR {
  constructor(...nums: bigint[]) {
    super(vect.bigint64, nums);
  }
}
export class VECTOR_BIGUINT64 extends VECTOR {
  constructor(...nums: bigint[]) {
    super(vect.biguint64, nums);
  }
}

export namespace Vector {
  export const std = (...nums: number[]) => new VECTOR_STD(...nums);

  export const int8 = (...nums: number[]) => new VECTOR_INT8(...nums);

  export const uint8 = (...nums: number[]) => new VECTOR_UINT8(...nums);

  export const uint8Clamped = (...nums: number[]) => new VECTOR_UINT8C(...nums);

  export const int16 = (...nums: number[]) => new VECTOR_INT16(...nums);

  export const uint16 = (...nums: number[]) => new VECTOR_UINT16(...nums);

  export const int32 = (...nums: number[]) => new VECTOR_INT32(...nums);

  export const uint32 = (...nums: number[]) => new VECTOR_UINT32(...nums);

  export const float32 = (...nums: number[]) => new VECTOR_FLOAT32(...nums);

  export const float64 = (...nums: number[]) => new VECTOR_FLOAT64(...nums);

  export const bigint64 = (...nums: bigint[]) => new VECTOR_BIGINT64(...nums);

  export const biguint64 = (...nums: bigint[]) => new VECTOR_BIGUINT64(...nums);
}
