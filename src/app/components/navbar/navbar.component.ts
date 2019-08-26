import { Data } from '../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  unit: boolean;
  color:boolean;

  constructor(private router: Router, private DataService: Data) {
    this.unit = false;
  }

  ngOnInit() {
    this.onLoadComponent();
    this.color=true;
  }
  onLoadComponent() {
    this.router.navigate(['/']);
  }
  changeUnit(unit: boolean) {
    if (unit) {
      this.unit = false;
      this.DataService.changeUnit(this.unit);
    } else {
      this.unit = true;
      this.DataService.changeUnit(this.unit);
    }
  }


}



