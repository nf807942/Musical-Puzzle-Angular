import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  links = ['./admin', './', '/Third', '/admin', '/play'];
  activeLink = this.links[0];

  constructor() { }

  ngOnInit(): void {
  }

}
