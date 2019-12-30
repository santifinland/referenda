import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {

  constructor(
    private metaTagService: Meta,
    private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. Política de Cookies';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
  }
}
