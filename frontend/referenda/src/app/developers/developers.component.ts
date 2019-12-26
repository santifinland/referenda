import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import SwaggerUI from 'swagger-ui';


@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss']
})
export class DevelopersComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. APIs y Recursos para Desarrolladores';
    this.titleService.setTitle(title);
    document.querySelector('meta[name="description"]').setAttribute('content', title);
    const ui = SwaggerUI({
      url: 'assets/swagger/referenda.json',
      dom_id: '#swagger-container',
      deepLinking: true
    });
  }
}
