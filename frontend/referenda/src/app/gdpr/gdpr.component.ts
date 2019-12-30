import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss']
})
export class GdprComponent implements OnInit {

  constructor(
      private metaTagService: Meta,
      private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. Protección de Datos';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
  }
}
