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
  parties: Party[];

  selectedParty: Party;
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
    this.getParties();
    let title: string;
    title = 'Partidos pol&iacute;ticos en el Congreso de los Diputados';
  }

  getLaws(): void {
    this.lawService.getLaws()
      .subscribe(laws => {
        this.laws = laws.filter(l => l.tier == 1);
      });
  }

  getParties(): void {
    this.partyService.getParties()
      .subscribe(parties => {
        this.parties = parties.filter(p => p.name != 'nd');
      });
  }

  selectParty(partyName): void {
    this.selectedParty = this.parties.filter(p => p.name == partyName)[0]
    this.selectedPartyPositiveLaws = this.laws.filter(l => l.positiveParties.includes(partyName));
    this.selectedPartyNegativeLaws = this.laws.filter(l => l.negativeParties.includes(partyName));
    this.selectedPartyAbstentionLaws = this.laws.filter(l => l.abstentionParties.includes(partyName));
  }
}
