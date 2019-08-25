export interface FiveDaysModel {
  DailyForecasts: [{
    Date: string,
    WeatherIcon:number;
    Temperature: {
      Minimum: {
        Value: number,
        Unit: string,
        UnitType: number
      },
      Maximum: {
        Value: number,
        Unit: string,
        UnitType: number
      }
    },
    Day: {
      Icon: 1,
      IconPhrase: string,
    },
    Night: {
      IconPhrase: string,
    }
  }];
}
