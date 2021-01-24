import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  constructor(
    private metaTagService: Meta,
    private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. Créditos';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
  }

}
