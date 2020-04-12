import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { Law } from '../_models/law';
import { LawService } from '../law.service';
import { Party } from '../_models/party';
import { PartyService } from '../_services/party.service';


@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.css']
})
export class PartiesComponent implements OnInit {

  laws: Law[];
  results: Law[];
  parties: Party[];

  selectedParty: Party;
  selectedPartyLaws: Law[];
  selectedPartyPositiveLaws: Law[];
  selectedPartyNegativeLaws: Law[];
  selectedPartyAbstentionLaws: Law[];

  lawFilter: any = { $or: [{ area: '', headline: ''}] }

  constructor(
      private lawService: LawService,
      private partyService: PartyService,
      private metaTagService: Meta,
      private router: Router,
      private titleService: Title) { }

  ngOnInit() {
    this.getLaws();
    this.getResults();
    this.getParties();
    let title: string;
    title = 'Partidos pol&iacute;ticos en el Congreso de los Diputados';
    this.metaTagService.updateTag({ name: 'description', content: title });
  }

  getLaws(): void {
    this.lawService.getAllLaws()
      .subscribe(laws => {
        this.laws = laws;
        this.selectParty('psoe');
      });
  }

  getResults(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        this.results = laws;
        this.selectParty('psoe');
      });
  }

  getParties(): void {
    this.partyService.getParties()
      .subscribe(parties => {
        this.parties = parties.filter(p => p.name != 'nd').sort((a, b) =>
          a.quota > b.quota ? -1 : a.quota === b.quota ? 0 : 1);
        this.selectParty('psoe');
      });
  }

  selectParty(partyName): void {
    this.selectedParty = this.parties.filter(p => p.name == partyName)[0]
    this.selectedPartyLaws = this.laws.filter(l => l.institution.includes(partyName));
    this.selectedPartyPositiveLaws = this.results.filter(l => l.positiveParties.includes(partyName));
    this.selectedPartyNegativeLaws = this.results.filter(l => l.negativeParties.includes(partyName));
    this.selectedPartyAbstentionLaws = this.results.filter(l => l.abstentionParties.includes(partyName));
  }

  filter(area: string) {
    this.lawFilter.area = (area == 'all') ? '' : area;
  }
}
