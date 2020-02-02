import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { Law } from '../_models/law';
import { LawService } from '../law.service';


@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.css']
})
export class LawsComponent implements OnInit {

  laws: Law[];

  constructor(
      private lawService: LawService,
      private metaTagService: Meta,
      private router: Router,
      private titleService: Title) { }

  ngOnInit() {
    this.getLaws();
    let title: string;
    if (this.router.url === '/') {
      title = 'Democracia directa';
    }  else {
      title = 'Leyes debatidas en el Congreso de los Diputados de España';
    }
  }

  getLaws(): void {
    this.lawService.getLaws()
      .subscribe(laws => {
        const tierLaws = laws.filter(law => law.tier === 1);
        tierLaws.map(law => {
          law.positiveWidth   = (15 + 40 * law.positive   / (law.positive + law.negative + law.abstention)) + '%';
          law.negativeWidth   = (15 + 40 * law.negative   / (law.positive + law.negative + law.abstention)) + '%';
          law.abstentionWidth = (15 + 40 * law.abstention / (law.positive + law.negative + law.abstention)) + '%';
        });
        this.laws = this.sortLaws(tierLaws);
      });
  }

  sortLaws(laws: Law[]) {
    return laws.sort((a, b) =>
      a.featured > b.featured ? -1 : a.featured === b.featured ? 0 : 1);
  }
}
