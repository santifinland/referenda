import { Component, OnInit } from '@angular/core';

import { Law } from '../law';
import { LawService } from '../law.service';


@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.css']
})
export class LawsComponent implements OnInit {

  laws: Law[];

  constructor(private lawService: LawService) { }

  ngOnInit() {
    this.getLaws();
  }

  getLaws(): void {
    this.lawService.getLaws()
      .subscribe(laws => {
        this.laws = laws;
        this.laws.map(law => {
          law.positiveWidth   = (50 * law.positive   / (law.positive + law.negative + law.abstention)) + "%";
          law.negativeWidth   = (50 * law.negative   / (law.positive + law.negative + law.abstention)) + "%";
          law.abstentionWidth = (50 * law.abstention / (law.positive + law.negative + law.abstention)) + "%";
        });
      });
  }
}
