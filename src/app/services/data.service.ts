import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class Data {
  private tempValue = new BehaviorSubject(false);

  private citySource = new BehaviorSubject(null);
  currentCity = this.citySource.asObservable();
  currentTempValue = this.tempValue.asObservable();

  constructor() {}

  changeCity(city: string) {
    this.citySource.next(city);
  }

  changeUnit(value: boolean) {
    this.tempValue.next(value);
  }
  
}
