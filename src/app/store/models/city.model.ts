export interface CityModel {

  key: number;
  city: string;
  Country: {
    ID: string;
    LocalizedName: string;
  },
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
  };
  weatherText: string;
  WeatherIcon:number;
  link: string;
  mobileLink: string;
  dayTime: boolean;
}

