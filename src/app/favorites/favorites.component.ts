
import { Component, OnInit } from '@angular/core';
import { CityModel } from '../store/models/city.model';
import { Data } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  public favoriteCities: CityModel[] = [];
  public exists: boolean;
  public checked: boolean;
  public unit: boolean;
  public loaded: boolean;
  constructor(private Data: Data, private router: Router) {
    this.exists = false;
    this.loaded = false;
  }

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.Data.currentTempValue.subscribe(response => {
      this.unit = response;
    });
    this.checkFavoriteCitiesExists();
  }
  moreInfoCity(city: string, key: number) {
    const data = {city, key};
    this.Data.changeCity(JSON.stringify(data));
    this.router.navigate(['/']);
  }
  checkFavoriteCitiesExists() {
    console.log('ddd');
    
    if (JSON.parse(localStorage.getItem('cities'))) {
      this.favoriteCities = JSON.parse(localStorage.getItem('cities'));
      this.exists = true;
    } else {
      this.exists = false;
    }
    
  }
}




