import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as fromRoot from "../../app.reducer";
import * as weatherActions from "../../store/actions/weather.action";

import { AutoCompleteModel } from "../../store/models/autoComplete.model";
import { CityModel } from "../../store/models/city.model";
import { WeatherModel } from "../../store/models/weather.model";
import { FiveDaysModel } from "../../store/models/fiveDays.model";
import { Data } from "../../services/data.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: "app-weather-card",
  templateUrl: "./weather-card.component.html",
  styleUrls: ["./weather-card.component.css"]
})
export class WeatherCardComponent implements OnInit {
  public currentSubscribe: Subscription;
  public dataToSubscribe: Subscription;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private currentWeather$: Subject<void> = new Subject<void>();

  public searchForm: FormGroup;

  public fiveDayWeather: FiveDaysModel;
  public currentWeather: WeatherModel;
  public City: CityModel;
  public favoriteCities: CityModel[] = [];
  public metric: boolean;
  public defaultKey: string;
  public defaultCity: string;
  public loaded: boolean;
  public exist: boolean;
  public unit: boolean;
  public suggestions: AutoCompleteModel[];

  constructor(private Data: Data, private store: Store<fromRoot.State>) {
    this.loaded = true;
    this.metric = true;
    this.exist = false;
  }

  //Init
  ngOnInit() {
    this.onLoad();
    this.searchForm = new FormGroup({
      search: new FormControl("", {
        validators: [Validators.required]
      })
    });
  }
  onLoad(): void {
    this.setData();
    this.Data.currentCity.subscribe(response => {
      if (response) {
        this.loaded = false;
        const data = {
          key: JSON.parse(response).key,
          city: JSON.parse(response).city
        };
        this.getWeather(data.key, data.city);
      } else {
        this.showGeoLocation();
      }
    });
  }

  //Search
  onInputChange($event): void {
    var input = $event.target.value;
    if (input === "") {
      this.suggestions = [];
    } else {
      this.getAutoComplete(input);
    }
  }
  //
  getAutoComplete(input: string) {
    this.store.dispatch(new weatherActions.GetAutoCompleteCities(input));
    this.dataToSubscribe = this.store
      .select(fromRoot.getWeatherData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data.loaded) {
          this.suggestions = data.data;
        }
      });
  }

  //Location
  showGeoLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const x = position.coords.latitude;
          const y = position.coords.longitude;
          const location = { x, y };
          this.store.dispatch(new weatherActions.GetGeoLocation(location));
          const dataToSubscribeGeo = this.store
            .select(fromRoot.getGeoLocationData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
              if (data.loaded) {
                this.defaultKey = data.data.Key;
                this.defaultCity = data.data.LocalizedName;
                this.getWeather(data.data.Key, data.data.LocalizedName);
                dataToSubscribeGeo.unsubscribe();
              }
            });
        },
        () => {
          this.getWeather(this.defaultKey, this.defaultCity);
          this.checkSpecificCity(this.defaultCity);
        }
      );
    }
  }

  //Get Current Weather
  getWeather(key: string, city: string): void {
    this.loaded = false;
    this.City.city = city;
    this.checkSpecificCity(city);
    const intKey = Number(key);
    this.getFiveDayWeather(intKey);
    this.store.dispatch(new weatherActions.GetCurrentWeather(intKey));
    this.currentSubscribe = this.store
      .select(fromRoot.getWeatherData)
      .pipe(takeUntil(this.currentWeather$))
      .subscribe(data => {
        if (data.loaded) {
          this.currentWeather = data.data[0];
          this.weatherCityData(intKey);
        }
      });
  }

  //Five Days Weather
  getFiveDayWeather(key: number): void {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    this.store.dispatch(new weatherActions.GetFiveDayWeather(key, this.metric));
    this.dataToSubscribe = this.store
      .select(fromRoot.getFiveDayWeatherData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data.loaded) {
          data.data.DailyForecasts.forEach(day => {
            day.Date = days[new Date(day.Date).getDay()];
          });
          this.fiveDayWeather = data.data.DailyForecasts;
        }
      });
  }

  //Change Unit
  changeUnit(): void {
    let i = 0;
    let value = 0;
    let fahToCelFormula = (value - 32) / (9 / 5);
    let celToFahFormula = value * (9 / 5) + 32;
    if (this.unit) {
      if (
        this.fiveDayWeather &&
        this.fiveDayWeather[0].Temperature.Minimum.Unit === "F"
      ) {
        for (i = 0; i < 5; i++) {
          value = this.fiveDayWeather[i].Temperature.Maximum.Value;
          fahToCelFormula = (value - 32) / (9 / 5);
          this.fiveDayWeather[
            i
          ].Temperature.Maximum.Value = fahToCelFormula.toFixed(0);
          value = this.fiveDayWeather[i].Temperature.Minimum.Value;
          fahToCelFormula = (value - 32) / (9 / 5);
          this.fiveDayWeather[
            i
          ].Temperature.Minimum.Value = fahToCelFormula.toFixed(0);
          this.fiveDayWeather[i].Temperature.Minimum.Unit = "C";
          this.fiveDayWeather[i].Temperature.Maximum.Unit = "C";
        }
      }
    } else {
      if (
        this.fiveDayWeather &&
        this.fiveDayWeather[0].Temperature.Minimum.Unit === "C"
      ) {
        for (i = 0; i < 5; i++) {
          value = this.fiveDayWeather[i].Temperature.Maximum.Value;
          celToFahFormula = value * (9 / 5) + 32;
          this.fiveDayWeather[
            i
          ].Temperature.Maximum.Value = celToFahFormula.toFixed(0);
          value = this.fiveDayWeather[i].Temperature.Minimum.Value;
          celToFahFormula = value * (9 / 5) + 32;
          this.fiveDayWeather[
            i
          ].Temperature.Minimum.Value = celToFahFormula.toFixed(0);
          this.fiveDayWeather[i].Temperature.Minimum.Unit = "F";
          this.fiveDayWeather[i].Temperature.Maximum.Unit = "F";
        }
      }
    }
  }

  //Add to the favorites
  addToFavorite(): void {
    this.checkIfExists();
    this.favoriteCities.push(this.City);
    localStorage.setItem("cities", JSON.stringify(this.favoriteCities));
    this.checkSpecificCity(this.City.city);
  }
  //Remove to the favorites
  removeFromFavorite(): void {
    this.checkIfExists();
    const index = this.favoriteCities.findIndex(
      city => city.city === this.City.city
    );
    if (index >= 0) {
      this.favoriteCities.splice(index, 1);
      localStorage.removeItem("cities");
      localStorage.setItem("cities", JSON.stringify(this.favoriteCities));
      this.checkSpecificCity(this.City.city);
    }
  }
  checkIfExists(): void {
    if (JSON.parse(localStorage.getItem("cities"))) {
      this.favoriteCities = JSON.parse(localStorage.getItem("cities"));
    }
  }
  checkSpecificCity(city: string): void {
    const index = this.favoriteCities.find(
      arrayCity => arrayCity.city === city
    );
    if (index) {
      this.exist = true;
    } else {
      this.exist = false;
    }
  }

  setModel(): void {
    this.City = {
      key: 0,
      city: "",
      Country: {
        ID: "",
        LocalizedName: ""
      },
      Temperature: {
        Metric: {
          Value: 0,
          Unit: "",
          UnitType: 0
        },
        Imperial: {
          Value: 0,
          Unit: "",
          UnitType: 0
        }
      },
      weatherText: "",
      WeatherIcon: 0,
      link: "",
      mobileLink: "",
      dayTime: false
    };
  }

  weatherCityData(intKey: number): void {
    this.City.key = intKey;
    this.City.dayTime = this.currentWeather.IsDayTime;
    this.City.Temperature = this.currentWeather.Temperature;
    this.City.weatherText = this.currentWeather.WeatherText;
    this.City.WeatherIcon = this.currentWeather.WeatherIcon;
  }

  setData(): void {
    this.Data.currentTempValue.subscribe(response => {
      this.unit = response;
      this.metric = response;
      this.changeUnit();
    });
    this.setModel();
    this.checkIfExists();
  }
}
