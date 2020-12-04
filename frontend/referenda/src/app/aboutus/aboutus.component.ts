import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {

  constructor(
    private metaTagService: Meta,
    private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. Democracia directa y delegación de voto';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
  }

}
