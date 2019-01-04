import { Component, OnInit } from '@angular/core';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { OrderModule } from 'ngx-order-pipe';

import { Law } from '../law';
import { LawService } from '../law.service';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  laws: Law[];

  lawFilter: any = { $or: [{ vote_end: '' }, { headline: '' }, { institution: '' }] }

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
