import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

import {matchSorter} from 'match-sorter';

import {Law} from '../_models/law';
import {LawService} from '../law.service';


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
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    this.smartphoneMenu = window.innerWidth > 640;
  }

  getLaws(): void {
    this.lawService.getLaws()
      .subscribe(laws => {
        const tierLaws = laws.filter(law => law.tier === 1);
        tierLaws.map(law => {
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
        });
        this.laws = this.sortLaws(tierLaws);
      });
  }

  toggleArea(area: string): void {
    if (this.area === '') {
      this.area = area;
    } else {
      this.area = '';
    }
  }

  toggleType(lawType: string): void {
    if (this.lawType === '') {
      this.lawType = lawType;
    } else {
      this.lawType = '';
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
        baseSort: (a, b) => (a.item.pub_date < b.item.pub_date ? -1 : 1)});
    return this.sortLaws(headlineLaws);
  }

  showSmartphoneMenu(show: boolean) {
    this.smartphoneMenu = show;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.smartphoneMenu = window.innerWidth > 640;
  }


}
