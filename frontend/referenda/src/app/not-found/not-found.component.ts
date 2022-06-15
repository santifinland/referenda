import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private metaTagService: Meta,
    private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. Democracia directa y delegación de voto';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
  }

}
