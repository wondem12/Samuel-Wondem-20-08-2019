import { GeolocationModel } from "../store/models/geolocation.model";
import { FiveDaysModel } from "../store/models/fiveDays.model";
import { WeatherModel } from "../store/models/weather.model";
import { HttpClient } from "@angular/common/http";
import { AutoCompleteModel } from "../store/models/autoComplete.model";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class WeatherService {
  Key = "OEGA12bifyY5meDkqq9KCTjnxlqm3cYq";
  Url = "http://dataservice.accuweather.com";

  constructor(private http: HttpClient) {}
  getAutocomplete(text: string) {
    return this.http.get<{ message: AutoCompleteModel[] }>(
      `${this.Url}/locations/v1/cities/autocomplete?apikey=${
        this.Key
      }&q=${text}`
    );
  }
  getCurrentWeatherGeolocation(data: GeolocationModel) {
    return this.http.get<{ Key: string; LocalizedName: string }>(
      `${this.Url}/locations/v1/cities/geoposition/search?apikey=${
        this.Key
      }&q=${data.x},${data.y}`
    );
  }
  getFiveDayForecasts(locationKey: number, metric: boolean) {
    return this.http.get<{ DailyForecasts: FiveDaysModel }>(
      `${this.Url}/forecasts/v1/daily/5day/${locationKey}?apikey=${
        this.Key
      }&metric=${metric}`
    );
  }
  getCurrentWeather(locationKey: number) {
    return this.http.get<{ message: WeatherModel }>(
      `${this.Url}/currentconditions/v1/${locationKey}?apikey=${
        this.Key
      }&details=false`
    );
  }
}
