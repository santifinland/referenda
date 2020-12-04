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

  lawFilter: any = { $or: [{ headline: '', area: '', law_type: '' }] };

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

  filter(area: string) {
    this.lawFilter.area = (area === 'all') ? '' : area;
  }

  filterLawType(lawType: string) {
    if (lawType === 'all') {
      this.lawFilter.law_type = { $or: [
        'Proposición de Ley',
        'Proposición de Ley Orgánica',
        'Proposición de Ley de reforma de Ley Orgánica',
        'Proposición de reforma constitucional',
        'Proposición de reforma del Reglamento del Congreso',
        'Proposición no de Ley',
        'Propuesta de candidato a la Presidencia del Gobierno',
        'Proyecto de Ley',
        'Real Decreto-Ley'
      ] };
    }
    if (lawType === 'legislativas') {
      this.lawFilter.law_type = { $or: [
        'Proposición de Ley',
        'Proposición de Ley Orgánica',
        'Proposición de Ley de reforma de Ley Orgánica',
        'Proposición de reforma constitucional',
        'Proposición de reforma del Reglamento del Congreso',
        'Propuesta de candidato a la Presidencia del Gobierno',
        'Proyecto de Ley',
        'Real Decreto-Ley'
      ] };
    }
    if (lawType === 'orientacion') {
      this.lawFilter.law_type = { $or: ['Proposición no de Ley'] };
    }
  }
}
