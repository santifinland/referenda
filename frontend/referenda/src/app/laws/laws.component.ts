import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

import {matchSorter} from 'match-sorter';
import {Subscription, timer} from 'rxjs';

import {Law, User, VoteResponse} from '../_models';
import {
  AuthenticationService,
  CookiesService,
  LawService,
  TransferStateService,
  UserService,
  WINDOW
} from '../_services';


@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.css']
})
export class LawsComponent implements OnInit {

  landing = true;
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
  partiesSlugs: string[] = [];
  scrolled = false;
  partiesPosition: string;

  currentUser: User | undefined;
  currentUserSubscription: Subscription;

  richSnippets = true;

  @HostListener('window:scroll') onScroll(e: Event): void {
    if (this.scrolled === false) {
      this.getLaws();
      this.scrolled = true;
    }
  }

  constructor(
    private cookiesService: CookiesService,
    private lawService: LawService,
    private metaTagService: Meta,
    private router: Router,
    private titleService: Title,
    private readonly transferStateService: TransferStateService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(WINDOW) private window: Window) {
    this.landing = !this.cookiesService.getLanding();
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    //this.transferStateService.fetch('laws', this.lawService.getLaws())
    //.subscribe(laws => {
    //const tierLaws = this.prepareLaws(laws.filter(law => law.tier === 1));
    //this.laws = this.sortLaws(tierLaws);
    //if (this.currentUser) {
    //this.laws = this.getVotes(this.laws);
    //}
    //});
    if (this.richSnippets) {
      this.richSnippets = false;
      this.setRichSnippetBreadcrumb()
    }
  }

  ngOnInit() {
    this.getLatestLaws();
    let title: string;
    if (this.router.url === '/') {
      title = 'Referenda - Democracia directa';
    } else {
      this.landing = false;
      title = 'Leyes debatidas en el Congreso de los Diputados de España';
    }
    this.titleService.setTitle(title);
    const content = "Referenda es una aplicación web de Democracia Directa y delegación de voto. " +
      "Nuestro objetivo es acercar la política a la ciudadanía. " +
      "Queremos formar una opinión pública responsable fomentando el conocimiento sobre nuestras leyes, " +
      "su proceso de creación y sus legisladores."
    this.metaTagService.updateTag({name: 'description', content: content});
    if (isPlatformBrowser(this.platformId)) {
      this.smartphoneMenu = window.innerWidth > 640;
    }
    this.partiesPosition = 'favour';
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
      '"name": "Iniciativas", ' +
      '"item": "https://referenda.es/leyes"' +
      '}]' +
      '}';
    const prev = this.document.getElementById('breadcrumb')
    if (prev) {
      prev.remove()
    }
    this.document.getElementsByTagName('head')[0].appendChild(script);
  }

  async getLatestLaws() {
    this.transferStateService.fetch('latestLaws', this.lawService.getLatestLaws())
      // this.lawService.getLatestLaws()
      .subscribe(laws => {
        const tierLaws = this.prepareLaws(laws.filter(law => law.tier === 1));
        this.laws = [... new Set(this.sortLaws(tierLaws))];
        if (this.currentUser) {
          this.laws = this.getVotes(this.laws);
        }
      });
    // const data = await this.lawService.getLaws().pipe(take(1)).toPromise();
    // this.laws = this.sortLaws(data);
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
    law.positiveWidth = (15 + 40 * law.positive / (law.positive + law.negative + law.abstention)) + '%';
    law.negativeWidth = (15 + 40 * law.negative / (law.positive + law.negative + law.abstention)) + '%';
    law.abstentionWidth = (15 + 40 * law.abstention / (law.positive + law.negative + law.abstention)) + '%';
    law.userPosition = 0;
    law.commentsLength = law.commentsLength || 0;
    return law;
  }

  async getLaws() {
    this.transferStateService.fetch('laws', this.lawService.getLaws())
      .subscribe(laws => {
        const tierLaws = this.prepareLaws(laws.filter(law => law.tier === 1));
        this.laws = [... new Set(this.sortLaws(tierLaws))];
        if (this.currentUser) {
          this.laws = this.getVotes(this.laws);
        }
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

  //sortLaws(laws: Law[]) {
  //return laws.sort((a, b) =>
  //a.featured > b.featured ? -1 : a.featured === b.featured ? 0 : 1);
  //}

  sortLaws(laws: Law[]) {
    return laws.sort((a, b) => {
      // Sort by featured
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      // Sort by pub_date
      const dateA = new Date(a.pub_date);
      const dateB = new Date(b.pub_date);
      if (dateA > dateB) {
        return -1;
      } else if (dateA < dateB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  lawsToShow(): Law[] {
    const typeLaws: Law[] = this.filterByType(this.laws);
    const uniqueLaws: Law[] = [...new Set(typeLaws)]
    const areaLaws: Law[] = matchSorter(uniqueLaws,
      this.area, {keys: [{threshold: matchSorter.rankings.STARTS_WITH, key: 'area'}]});
    const headlineLaws = matchSorter(
      areaLaws,
      this.headline,
      {
        keys: ['headline'],
        baseSort: (a, b) => (a.item.pub_date < b.item.pub_date ? -1 : 1),
        threshold: matchSorter.rankings.CONTAINS
      });
    return this.sortLaws(headlineLaws);
  }

  lawsTwo(): Law[] {
    if (isPlatformBrowser(this.platformId)) {
      switch (true) {
        case window.innerWidth <= 1165:
          return
        case window.innerWidth <= 1920:
          return this.lawsToShow().slice(0, 1)
        case window.innerWidth > 1920:
          return [...new Set(this.lawsToShow().slice(0, 2))]
      }
    } else {
      return
    }
  }

  lawsRest(): Law[] {
    if (isPlatformBrowser(this.platformId)) {
      switch (true) {
        case window.innerWidth <= 1165:
          return this.lawsToShow()
        case window.innerWidth <= 1920:
          return this.lawsToShow().slice(1)
        case window.innerWidth > 1920:
          return this.lawsToShow().slice(2)
      }
    } else {
      return
    }
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

  showPartiesMenu(slug: string) {
    if (this.partiesSlugs.includes(slug)) {
      const index = this.partiesSlugs.indexOf(slug);
      if (index >= 0) {
        this.partiesSlugs.splice(index, 1);
      }
    } else {
      this.partiesSlugs.push(slug);
    }
  }

  getLaw(slug): void {
    this.lawService.getLaw(slug)
      .subscribe(law => {
        law = this.prepareLaw(law);
        this.laws = this.laws.map(l => l.slug !== law.slug ? l : law);
        if (this.currentUser) {
          this.laws = this.getVotes(this.laws);
        }
      });
  }

  getVotes(laws: Law[]): Law[] {
    return laws.map(law => this.getVote(law))
  }

  getVote(law: Law): Law {
    this.lawService.getLawVote(law.slug)
      .subscribe(
        (data: VoteResponse) => {
          if (data.positive > 0) {
            law.userPosition = 1;
          } else if (data.negative > 0) {
            law.userPosition = 2;
          } else if (data.abstention > 0) {
            law.userPosition = 3;
          } else {
            law.userPosition = 0;
          }
        },
      );
    return law
  }

  submitVote(slug: string, vote: number): void {
    if (this.currentUser !== undefined) {
      this.lawService.submitVote(slug, vote)
        .subscribe(
          (data: VoteResponse) => {
            this.getLaw(slug);
          },
          err => this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url))
        );
    } else {
      this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url));
    }
  }

  logoWidth(party: string): string {
    let width = '30px';
    switch (party) {
      case 'psoe': {
        width = '30px';
        break;
      }
      case 'pp': {
        width = '30px';
        break;
      }
      case 'vox': {
        width = '50px';
        break;
      }
      case 'podemos': {
        width = '69px';
        break;
      }
      case 'ciudadanos': {
        width = '100px';
        break;
      }
      case 'erc': {
        width = '96px';
        break;
      }
      case 'jpc': {
        width = '24px';
        break;
      }
      case 'pnv': {
        width = '30px';
        break;
      }
      case 'bildu': {
        width = '50px';
        break;
      }
      case 'mp': {
        width = '36px';
        break;
      }
      case 'cup': {
        width = '34px';
        break;
      }
      case 'cc': {
        width = '37px';
        break;
      }
      case 'upn': {
        width = '49px';
        break;
      }
      case 'bng': {
        width = '34px';
        break;
      }
      case 'prc': {
        width = '48px';
        break;
      }
      case 'te': {
        width = '34px';
        break;
      }
      default: {
        break;
      }
    }
    return width;
  }

  logoHeight(party: string): string {
    let height = '30px';
    switch (party) {
      case 'psoe': {
        height = '29px';
        break;
      }
      case 'pp': {
        height = '30px';
        break;
      }
      case 'vox': {
        height = '25px';
        break;
      }
      case 'podemos': {
        height = '17px';
        break;
      }
      case 'ciudadanos': {
        height = '25px';
        break;
      }
      case 'erc': {
        height = '19px';
        break;
      }
      case 'jpc': {
        height = '23px';
        break;
      }
      case 'pnv': {
        height = '30px';
        break;
      }
      case 'bildu': {
        height = '19px';
        break;
      }
      case 'mp': {
        height = '23px';
        break;
      }
      case 'cup': {
        height = '35px';
        break;
      }
      case 'cc': {
        height = '35px';
        break;
      }
      case 'upn': {
        height = '30px';
        break;
      }
      case 'bng': {
        height = '37px';
        break;
      }
      case 'prc': {
        height = '15px';
        break;
      }
      case 'te': {
        height = '33px';
        break;
      }
      default: {
        break;
      }
    }
    return height;
  }
}
