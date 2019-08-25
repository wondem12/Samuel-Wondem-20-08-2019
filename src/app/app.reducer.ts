import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";
import * as weatherReducer from "./store/reducers/weather.reducer";
import * as fiveDayReducer from "./store/reducers/fiveDayWeather.reducer";
import * as geoLocationReducer from "./store/reducers/geolocation.reducer";

export interface State {
  weatherReducer: weatherReducer.State;
  fiveDayWeatherReducer: fiveDayReducer.State;
  geoLocationWeatherReducer: geoLocationReducer.State;
}
export const Reducers: ActionReducerMap<State> = {
  weatherReducer: weatherReducer.weatherReducer,
  fiveDayWeatherReducer: fiveDayReducer.fiveDayWeatherReducer,
  geoLocationWeatherReducer: geoLocationReducer.geoLocationReducer
};

export const getWeatherReducer = createFeatureSelector<weatherReducer.State>(
  "weatherReducer"
);
export const getFiveDayWeatherReducer = createFeatureSelector<
fiveDayReducer.State
>("fiveDayWeatherReducer");
export const getGeoLocationReducer = createFeatureSelector<
geoLocationReducer.State
>("geoLocationWeatherReducer");
export const getWeatherData = createSelector(
  getWeatherReducer,
  weatherReducer.getWeatherData
);
export const getFiveDayWeatherData = createSelector(
  getFiveDayWeatherReducer,
  fiveDayReducer.getFiveDayWeatherData
);
export const getGeoLocationData = createSelector(
  getGeoLocationReducer,
  geoLocationReducer.getGeoLocationData
);
