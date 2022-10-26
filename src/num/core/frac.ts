class Frac {
  n: number;
  d: number;
  constructor(n: number, d: number) {
    this.n = n;
    this.d = d;
  }
  float() {
    return this.n / this.d;
  }
  print() {
    console.log(`${this.n}/${this.d}`);
  }
}

const frac = (n: number, d: number) => new Frac(n, d);
