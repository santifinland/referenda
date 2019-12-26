import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. Política de Cookies';
    this.titleService.setTitle(title);
    document.querySelector('meta[name="description"]').setAttribute('content', title);
  }
}
