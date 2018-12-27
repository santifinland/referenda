import { Component, ElementRef, OnInit } from '@angular/core';

import SwaggerUI from 'swagger-ui';


@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss']
})
export class DevelopersComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    const ui = SwaggerUI({
      url: 'assets/swagger/referenda.json',
      domNode: this.el.nativeElement.querySelector('.swagger-container'),
      deepLinking: true
    });
  }
}
