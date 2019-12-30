import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import SwaggerUI from 'swagger-ui';


@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss']
})
export class DevelopersComponent implements OnInit {

  constructor(
      private metaTagService: Meta,
      private titleService: Title,
      @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    const title = 'Referenda. APIs y Recursos para Desarrolladores';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    if (isPlatformBrowser(this.platformId)) {
      const ui = SwaggerUI({
        url: 'assets/swagger/referenda.json',
        dom_id: '#swagger-container',
        deepLinking: true
      });
    }
  }
}
