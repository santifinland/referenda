import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Law } from '../_models/law';
import { LawService } from '../law.service';


@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.css']
})
export class LawsComponent implements OnInit {

  laws: Law[];

  constructor(private lawService: LawService, private titleService: Title) { }

  ngOnInit() {
    this.getLaws();
    this.titleService.setTitle( "Referenda. Democracia directa" );
  }

  getLaws(): void {
    this.lawService.getLaws()
      .subscribe(laws => {
        this.laws = laws.filter(law => law.tier == 1);
        this.laws.map(law => {
          law.positiveWidth   = (50 * law.positive   / (law.positive + law.negative + law.abstention)) + "%";
          law.negativeWidth   = (50 * law.negative   / (law.positive + law.negative + law.abstention)) + "%";
          law.abstentionWidth = (50 * law.abstention / (law.positive + law.negative + law.abstention)) + "%";
        });
      });
  }
}
