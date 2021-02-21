import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {isPlatformBrowser} from '@angular/common';

import {matchSorter } from 'match-sorter';

import {Law, VoteResponse} from '../_models';
import {LawService, TransferStateService, WINDOW} from '../_services';


@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.css']
})
export class LawsComponent implements OnInit {

  laws: Law[] = [];
  headline = '';
  area = '';
  lawType = '';
  legislativas = [
    'proposición de ley',
    'proposición ley orgánica',
    'proposición de ley de reforma de ley orgánica',
    'proposición de reforma constitucional',
    'proposición de reforma del reglamento del congreso',
    'propuesta de candidato a la presidencia del gobierno',
    'proyecto de ley',
    'real decreto-ley'];
  orientativas = ['proposición no de ley'];
  smartphoneMenu = false;
  voterSlugs: string[] = [];
  vote = '';

  constructor(
      private lawService: LawService,
      private metaTagService: Meta,
      private router: Router,
      private titleService: Title,
      private readonly transferStateService: TransferStateService,
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(WINDOW) private window: Window) { }

  ngOnInit() {

    this.getLatestLaws();
    let title: string;
    if (this.router.url === '/') {
      title = 'Democracia directa';
    }  else {
      title = 'Leyes debatidas en el Congreso de los Diputados de España';
    }
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    if (isPlatformBrowser(this.platformId)) {
      this.smartphoneMenu = window.innerWidth > 640;
    }
    this.getLaws();
  }

  getLatestLaws(): void {
    this.transferStateService.fetch('latestLaws', this.lawService.getLatestLaws())
      .subscribe(laws => {
        const tierLaws = this.prepareLaws(laws.filter(law => law.tier === 1));
        this.laws = this.sortLaws(tierLaws);
      });
  }

  prepareLaws(laws: Law[]): Law[] {
    laws.map(law => this.prepareLaw(law));
    return laws;
  }

  prepareLaw(law: Law): Law {
    law.isPositive = law.positive > law.negative && law.positive > law.abstention;
    law.isNegative = law.negative > law.positive && law.negative > law.abstention;
    law.isAbstention = law.abstention > law.positive && law.abstention > law.negative;
    const totalVotes = law.positive + law.negative + law.abstention;
    law.positivePercentage = totalVotes === 0 ? 0 : 100 * law.positive / totalVotes;
    law.negativePercentage = totalVotes === 0 ? 0 : 100 * law.negative / totalVotes;
    law.abstentionPercentage = totalVotes === 0 ? 0 : 100 * law.abstention / totalVotes;
    law.positiveWidth   = (15 + 40 * law.positive   / (law.positive + law.negative + law.abstention)) + '%';
    law.negativeWidth   = (15 + 40 * law.negative   / (law.positive + law.negative + law.abstention)) + '%';
    law.abstentionWidth = (15 + 40 * law.abstention / (law.positive + law.negative + law.abstention)) + '%';
    return law;
  }

  getLaws(): void {
    this.transferStateService.fetch('laws', this.lawService.getLaws())
      .subscribe(laws => {
        const tierLaws = this.prepareLaws(laws.filter(law => law.tier === 1));
        this.laws = this.sortLaws(tierLaws);
      });
  }

  toggleArea(area: string): void {
    if (this.area === area) {
      this.area = '';
    } else {
      this.area = area;
    }
  }

  toggleType(lawType: string): void {
    if (this.lawType === lawType) {
      this.lawType = '';
    } else {
      this.lawType = lawType;
    }
  }

  isLegislativa(law: Law): boolean {
    return this.legislativas.indexOf(law.law_type.toLowerCase()) >= 0;
  }

  filterByType(laws: Law[]): Law[] {
    if (this.lawType === '') {
      return laws;
    } else if (this.lawType === 'legislativa') {
      return laws.filter(law => this.isLegislativa(law));
    } else {
      return laws.filter(law => this.orientativas.includes(law.law_type.toLowerCase()));
    }
  }

  sortLaws(laws: Law[]) {
    return laws.sort((a, b) =>
      a.featured > b.featured ? -1 : a.featured === b.featured ? 0 : 1);
  }

  lawsToShow(): Law[] {
    const typeLaws: Law[] = this.filterByType(this.laws);
    const areaLaws: Law[] = matchSorter(typeLaws,
      this.area, {keys: [{threshold: matchSorter.rankings.STARTS_WITH, key: 'area'}]});
    const headlineLaws = matchSorter(
      areaLaws,
      this.headline,
      {keys: ['headline'],
       baseSort: (a, b) => (a.item.pub_date < b.item.pub_date ? -1 : 1),
       threshold: matchSorter.rankings.CONTAINS});
    return this.sortLaws(headlineLaws);
  }

  showSmartphoneMenu() {
    this.smartphoneMenu = !this.smartphoneMenu;
  }

  showVoterMenu(slug: string) {
    if (this.voterSlugs.includes(slug)) {
      const index = this.voterSlugs.indexOf(slug);
      if (index >= 0) {
        this.voterSlugs.splice(index, 1);
      }
    } else {
      this.voterSlugs.push(slug);
    }
  }

  getLaw(slug): void {
    this.lawService.getLaw(slug)
      .subscribe(law => {
        law = this.prepareLaw(law);
        this.laws = this.laws.map(l => l.slug !== law.slug ? l : law);
      });
  }

  submitVote(slug: string, vote: number): void {
    this.lawService.submitVote(slug, vote)
      .subscribe(
        (data: VoteResponse) => { this.getLaw(slug); },
        err => this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url))
      );
  }
}
