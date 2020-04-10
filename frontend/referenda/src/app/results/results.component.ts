import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { Law } from '../_models/law';
import { LawService } from '../law.service';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  laws: Law[];

  lawFilter: any = { $or: [{ vote_end: '' }, { headline: '' }, { institution: '' }] }

  constructor(
      private lawService: LawService,
      private metaTagService: Meta,
      private titleService: Title) { }

  ngOnInit() {
    const title = 'Resultados de votaciones Congreso de los Diputados';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    this.getResults();
  }

  getResults(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        this.laws = laws;
      });
  }
}
