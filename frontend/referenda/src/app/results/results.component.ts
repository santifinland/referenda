import { APP_ID, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {DOCUMENT, formatDate, isPlatformBrowser} from '@angular/common';

import { matchSorter } from 'match-sorter';

import { Law } from '../_models';
import { LawService } from '../_services';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  laws: Law[];
  headline = '';
  fecha = '';
  institution = '';
  approved = false;
  notApproved = false;
  searchMenu = false;
  richSnippets = true;

  constructor(
      private lawService: LawService,
      private metaTagService: Meta,
      private titleService: Title,
      @Inject(DOCUMENT) private document: Document,
      @Inject(PLATFORM_ID) private platformId: object,
      @Inject(APP_ID) private appId: string) {

    if (this.richSnippets) {
      this.richSnippets = false;
      this.setRichSnippetBreadcrumb()
    }
  }

  ngOnInit() {
    const title = 'Resultados de votaciones Congreso de los Diputados';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    this.getResults();
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
        '"name": "Resultados", ' +
        '"item": "https://referenda.es/resultados"' +
      '}]' +
      '}';
    const prev = this.document.getElementById('breadcrumb')
    if (prev) {
      prev.remove()
    }
    this.document.getElementsByTagName('head')[0].appendChild(script);
  }

  getResults(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        const platform = isPlatformBrowser(this.platformId) ? 'in the browser' : 'on the server';
        console.log(`getUsers : Running ${platform} with appId=${this.appId}`);
        laws.map(law => {
          law.vote_end_string = formatDate(law.vote_end, 'fullDate', 'es-ES');
        });
        this.laws = laws;
      });

  }

  isApproved(law: Law): boolean {
    return law.official_positive >= law.official_negative
  }

  filterByApproval(laws: Law[]): Law[] {
    if (!this.approved && !this.notApproved) {
      return laws;
    } else if (this.approved) {
      return laws.filter(law => this.isApproved(law));
    } else {
      return laws.filter(law => !this.isApproved(law));
    }
  }

  lawsToShow(): Law[] {
    const approvalLaws: Law[] = this.filterByApproval(this.laws);
    const dateLaws: Law[] = matchSorter(approvalLaws,
      this.fecha, {keys: [{threshold: matchSorter.rankings.MATCHES, key: 'vote_end_string'}]});
    const institutionLaws: Law[] = matchSorter(dateLaws,
      this.institution, {keys: [{threshold: matchSorter.rankings.STARTS_WITH, key: 'institution'}]});
    const headlineLaws = matchSorter(
      institutionLaws,
      this.headline,
      {keys: ['headline'],
       baseSort: (a, b) => (a.item.vote_end > b.item.vote_end ? -1 : 1),
       threshold: matchSorter.rankings.CONTAINS});
    return headlineLaws;
  }

  toggleApproved(): void {
    this.approved = !this.approved;
    if (this.notApproved) {
      this.notApproved = false;
    }
    window.scroll({top: 0, behavior: 'smooth'});
  }

  toggleNotApproved(): void {
    this.notApproved = !this.notApproved;
    if (this.approved) {
      this.approved = false;
    }
    window.scroll({top: 0, behavior: 'smooth'});
  }

  showSearchMenu() {
    this.searchMenu = !this.searchMenu;
  }
}
