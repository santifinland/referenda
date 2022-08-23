import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

import {matchSorter} from 'match-sorter';

import {Law, Party} from '../_models';
import {LawService, WINDOW} from '../_services';
import {PartyService} from '../_services/party.service';


@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.css']
})
export class PartiesComponent implements OnInit {

  laws: Law[];
  results: Law[];
  parties: Party[];
  headline = '';
  position = '';

  selectedParty: Party;

  mobile = false;
  mobileMenu = false;
  positionMenu = false;
  richSnippets = true;

  constructor(
      private lawService: LawService,
      private partyService: PartyService,
      private metaTagService: Meta,
      private router: Router,
      private titleService: Title,
      @Inject(DOCUMENT) private document: Document,
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(WINDOW) private window: Window) {

        if (this.richSnippets) {
          this.richSnippets = false;
          this.setRichSnippetBreadcrumb()
        }
  }

  ngOnInit() {
    this.getLaws();
    this.getResults();
    this.getParties();
    let title: string;
    title = 'Partidos pol&iacute;ticos en el Congreso de los Diputados';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    if (isPlatformBrowser(this.platformId)) {
      this.mobile = window.innerWidth < 761;
    }
  }

  setRichSnippetBreadcrumb() {
    let script = this.document.createElement('script');
    script.id = 'breadcrumb';
    script.type = 'application/ld+json';
    script.text = '{' +
      '"@context": "https://schema.org", ' +
      '"@type": "BreadcrumbList", ' +
      '"itemListElement": [{' +
        '"@type": "ListItem", ' +
        '"position": 1, ' +
        '"name": "Partidos Políticos", ' +
        '"item": "https://referenda.es/partidos"' +
      '}]' +
      '}';
    const prev = this.document.getElementById('breadcrumb')
    if (prev) {
      prev.remove()
    }
    this.document.getElementsByTagName('head')[0].appendChild(script);
  }

  getLaws(): void {
    this.lawService.getAllLaws()
      .subscribe(laws => {
        this.laws = laws;
      });
  }

  getResults(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        this.results = laws;
        console.log(this.results);
      });
  }

  getParties(): void {
    this.partyService.getParties()
      .subscribe(parties => {
        this.parties = parties.filter(p => p.name !== 'nd').sort((a, b) =>
          a.quota > b.quota ? -1 : a.quota === b.quota ? 0 : 1);
        this.selectParty('psoe');
      });
  }

  selectParty(partyName): void {
    this.selectedParty = this.parties.filter(p => p.name === partyName)[0];
  }

  togglePosition(position: string): void {
    if (this.position === position) {
      this.position = '';
    } else {
      this.position = position;
    }
    this.positionMenu = false;
  }

  matchSorLaws(laws: Law[]): Law[] {
    return matchSorter(
      laws,
      this.headline,
      {
        keys: ['headline'],
        baseSort: (a, b) => (a.item.pub_date < b.item.pub_date ? -1 : 1),
        threshold: matchSorter.rankings.CONTAINS
      });
  }

  lawsToShow(): Law[] {
    if (this.laws) {
      const partyLaws = this.laws.filter(l => l.institution.includes(this.selectedParty.name));
      return this.matchSorLaws(partyLaws);
    } else {
      return [];
    }
  }

  positiveResultsToShow(): Law[] {
    if (this.results) {
      const partyLaws = this.results.filter(l => l.positiveParties.includes(this.selectedParty.name));
      return this.matchSorLaws(partyLaws);
    } else {
      return [];
    }
  }

  negativeResultsToShow(): Law[] {
    if (this.results) {
      const partyLaws = this.results.filter(l => l.negativeParties.includes(this.selectedParty.name));
      return this.matchSorLaws(partyLaws);
    } else {
      return [];
    }
  }

  abstentionResultsToShow(): Law[] {
    if (this.results) {
      const partyLaws = this.results.filter(l => l.abstentionParties.includes(this.selectedParty.name));
      return this.matchSorLaws(partyLaws);
    } else {
      return [];
    }
  }

  noVotedResultsToShow(): Law[] {
    if (this.results) {
      const pos =  this.results.filter(l => !l.positiveParties.includes(this.selectedParty.name));
      const neg =  pos.filter(l => !l.negativeParties.includes(this.selectedParty.name));
      const abs =  neg.filter(l => !l.abstentionParties.includes(this.selectedParty.name));
      return this.matchSorLaws(abs);
    } else {
      return [];
    }
  }

  logoWidth(party: string, scale: number = 1): string {
    let width = 30;
    switch (party) {
      case 'psoe':       { width = 30; break; }
      case 'pp':         { width = 30; break; }
      case 'vox':        { width = 50; break; }
      case 'podemos':    { width = 69; break; }
      case 'ciudadanos': { width = 100; break; }
      case 'erc':        { width = 96; break; }
      case 'jpc':        { width = 24; break; }
      case 'pnv':        { width = 30; break; }
      case 'bildu':      { width = 50; break; }
      case 'mp':         { width = 36; break; }
      case 'cup':        { width = 34; break; }
      case 'cc':         { width = 37; break; }
      case 'upn':        { width = 49; break; }
      case 'bng':        { width = 34; break; }
      case 'prc':        { width = 48; break; }
      case 'te':         { width = 34; break; }
      default: { break; }
    }
    const scaledWidth = width * scale;
    return scaledWidth.toString() + 'px';
  }

  logoHeight(party: string, scale: number = 1): string {
    let height = 30;
    switch (party) {
      case 'psoe':       { height = 29; break; }
      case 'pp':         { height = 30; break; }
      case 'vox':        { height = 25; break; }
      case 'podemos':    { height = 17; break; }
      case 'ciudadanos': { height = 25; break; }
      case 'erc':        { height = 19; break; }
      case 'jpc':        { height = 23; break; }
      case 'pnv':        { height = 30; break; }
      case 'bildu':      { height = 19; break; }
      case 'mp':         { height = 23; break; }
      case 'cup':        { height = 35; break; }
      case 'cc':         { height = 35; break; }
      case 'upn':        { height = 30; break; }
      case 'bng':        { height = 37; break; }
      case 'prc':        { height = 15; break; }
      case 'te':         { height = 33; break; }
      default: { break; }
    }
    const scaledHeight = height * scale;
    return scaledHeight.toString() + 'px';
  }
}
