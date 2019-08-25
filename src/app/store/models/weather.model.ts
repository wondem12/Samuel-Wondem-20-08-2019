export interface WeatherModel {
  
  LocalObservationDateTime: string;
  WeatherText: string;
  WeatherIcon:number;
  IsDayTime: boolean;
  Temperature: {
    Metric: {
      Value: number,
      Unit: string,
      UnitType: number
    },
    Imperial: {
      Value: number,
      Unit: string,
      UnitType: number
    }
  }
}
