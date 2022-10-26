import { angleUnit } from "@type";

export class Angle {
  private value: number;
  private unt: string;
  constructor(value: number, unt: angleUnit = "rad") {
    this.value = value;
    this.unt = unt;
  }
  get unit() {
    return this.unt;
  }
  get val() {
    return this.value;
  }
  toRad() {
    if (this.unt === "rad") {
      return this;
    } else {
      this.unt = "rad";
      this.value = this.value * 57.296;
      return this;
    }
  }
  toDeg() {
    if (this.unt === "deg") {
      return this;
    } else {
      this.unt = "deg";
      this.value = (this.value * 180) / Math.PI;
    }
  }
}

export const angle = (val: number = 0, unt: angleUnit = "rad") =>
  new Angle(val, unt);
