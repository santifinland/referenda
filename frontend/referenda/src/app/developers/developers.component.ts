import { Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import SwaggerUI from 'swagger-ui';


@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss']
})
export class DevelopersComponent implements OnInit {

  constructor(private el: ElementRef, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Referenda. APIs y Recursos para Desarrolladores');
    const ui = SwaggerUI({
      url: 'assets/swagger/referenda.json',
      domNode: this.el.nativeElement.querySelector('.swagger-container'),
      deepLinking: true
    });
  }
}
