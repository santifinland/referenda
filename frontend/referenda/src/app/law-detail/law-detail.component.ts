import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {isPlatformBrowser, DOCUMENT} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {first} from 'rxjs/operators';

import {Law, VoteResponse} from '../_models';
import {LawService, WINDOW} from '../_services';


@Component({
  selector: 'app-law-detail',
  templateUrl: './law-detail.component.html',
  styleUrls: ['./law-detail.component.css']
})
export class LawDetailComponent implements OnInit {

  law: Law = new Law();
  richSnippets = true;
  facebook: string;
  twitter: string;

  userPosition: number = 0;
  partiesPosition: string;
  yesHover: boolean;
  noHover: boolean;
  absHover: boolean;

  official_total = 0;
  resultsCongreso = false;

  message: String = 'Cargando...';
  private facebookPrefix = 'https://www.facebook.com/sharer/sharer.php?u=';
  private facebookSuffix = '%2F&amp;src=sdkpreparse';

  commentForm: FormGroup;
  submitted = false;

  currentState = true;
  readMore = false;
  numComments = 0;
  finished = false;
  approved = false;
  vote = '';
  comments = false;
  tab = 'all';
  mobile = false;
  voterMenu = false;
  mobileCommentsMenu = false;
  addCommentMenu = false;

  location: string;
  partiesSlugs: string[] = [];

  constructor(
    private lawService: LawService,
    private formBuilder: FormBuilder,
    private metaTagService: Meta,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(WINDOW) private window: Window) {
      this.route.params.subscribe(params => this.getLaw(params['slug']));
      this.location = 'https://referenda.es' + this.router.url;
  }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
    this.partiesPosition = 'favour';
    this.activatedRoute.queryParams.subscribe(params => {
      this.mobileCommentsMenu = params['comments'] === 'true';
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  get f() {
    return this.commentForm.controls;
  }

  getLaw(slug): void {
    const today = new Date();
    this.lawService.getLaw(slug)
      .subscribe(law => {
        const title = law.headline;
        this.titleService.setTitle(title);
        this.metaTagService.updateTag({name: 'description', content: law.short_description});
        law.positiveWidth = (50 * law.positive / (law.positive + law.negative + law.abstention)) + '%';
        law.negativeWidth = (50 * law.negative / (law.positive + law.negative + law.abstention)) + '%';
        law.abstentionWidth = (50 * law.abstention / (law.positive + law.negative + law.abstention)) + '%';
        this.official_total = law.official_positive + law.official_negative + law.official_abstention;
        if (this.official_total > 0) {
          this.resultsCongreso = true;
        }
        law.officialPositiveWidth = (50 * law.official_positive / this.official_total) + '%';
        law.officialNegativeWidth = (50 * law.official_negative / this.official_total) + '%';
        law.officialAbstentionWidth = (50 * law.official_abstention / this.official_total) + '%';
        const totalVotes = law.positive + law.negative + law.abstention;
        law.positivePercentage = totalVotes === 0 ? 0 : 100 * law.positive / totalVotes;
        law.negativePercentage = totalVotes === 0 ? 0 : 100 * law.negative / totalVotes;
        law.abstentionPercentage = totalVotes === 0 ? 0 : 100 * law.abstention / totalVotes;
        this.finished = new Date(law.vote_end).getTime() < today.getTime();
        this.approved = this.finished && law.official_positive > law.official_negative
        this.numComments = law.comments.length;
        this.law = law;
        this.facebook = this.facebookPrefix + law.headline + this.facebookSuffix;
        this.dateComments();
        if (isPlatformBrowser(this.platformId)) {
          this.mobile = window.innerWidth < 640;
        }
        this.getVote(law.slug);
        if (this.numComments === 0) {
          this.addCommentMenu = true;
        }

        if (this.richSnippets) {
          this.richSnippets = false;
          this.setRichSnippetBreadcrumb()
          this.setRichSnippetLegislation()
          this.setRichSnippetFAQ()
        }

      });
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

  setRichSnippetLegislation() {
    let script = this.document.createElement('script');
    script.id = 'legislation';
    script.type = 'application/ld+json';
    script.text = '{' +
      '"@context": "https://schema.org", ' +
      '"@type": "Legislation", ' +
      '"headline": "' + this.law.headline + '"' +
      '}';
    const prev = this.document.getElementById('legislation')
    if (prev) {
      prev.remove()
    }
    this.document.getElementsByTagName('head')[0].appendChild(script);
  }

  setRichSnippetFAQ() {
    let script = this.document.createElement('script');
    script.id = 'faq';
    script.type = 'application/ld+json';
    script.text = '{' +
      '"@context": "https://schema.org", ' +
      '"@type": "FAQPage", ' +
      '"mainEntity": [' +

      '{' +
        '"@type": "Question", ' +
        '"name": "¿Quién ha propuesto esta iniciativa?", ' +
        '"acceptedAnswer": {' +
          '"@type": "Answer", ' +
          '"text": "' + this.institucionNames(this.law.institution) + '"' +
          //meter FAQ con grupo politico, etc, quien está a favor, quien en contra, etc
        '} ' +
      '}, ' +

      '{' +
        '"@type": "Question", ' +
        '"name": "¿Se ha aprobado esta iniciativa?", ' +
        '"acceptedAnswer": {' +
          '"@type": "Answer", ' +
          '"text": "' + this.finishedApproved() + '"' +
        '} ' +
      '}, ' +

      '{' +
        '"@type": "Question", ' +
        '"name": "¿Qué partidos políticos están a favor de esta iniciativa?", ' +
        '"acceptedAnswer": {' +
          '"@type": "Answer", ' +
          '"text": "' + this.institucionNames(this.law.positiveParties) + '"' +
        '} ' +
      '}, ' +

      '{' +
        '"@type": "Question", ' +
        '"name": "¿Qué partidos políticos están en contra de esta iniciativa?", ' +
        '"acceptedAnswer": {' +
          '"@type": "Answer", ' +
          '"text": "' + this.institucionNames(this.law.negativeParties) + '"' +
        '} ' +
      '} ' +

      ']' +
      '}';
    const prev = this.document.getElementById('faq')
    if (prev) {
      prev.remove()
    }
    this.document.getElementsByTagName('head')[0].appendChild(script);
  }

  finishedApproved() {
    if (this.finished) {
      if (this.approved) {
        return "Esta iniciativa ha sido aprobada con " + this.law.official_positive + " votos a favor, " +
          this.law.official_negative + " votos en contra y " + this.law.official_abstention + " abstenciones."
      } else {
        return "Esta iniciativa ha sido rechazada con " + this.law.official_positive + " votos a favor, " +
          this.law.official_negative + " votos en contra y " + this.law.official_abstention + " abstenciones."
      }
    } else {
      return "Esta iniciativa todavía no se ha votado"
    }
  }


  toggle() {
    this.readMore = !this.readMore;
    if (isPlatformBrowser(this.platformId)) {
      if (!this.readMore) {
        window.scroll({top: 0, behavior: 'smooth'});
      }
    }
  }

  getVote(slug: string): void {
    this.lawService.getLawVote(slug)
      .subscribe(
        (data: VoteResponse) => {
          if (data.positive > 0) {
            this.userPosition = 1
          } else if (data.negative > 0) {
            this.userPosition = 2
          } else if (data.abstention > 0) {
            this.userPosition = 3
          } else {
            this.userPosition = 0
          }
        },
      );
  }

  submitVote(slug: string, vote: number): void {
    this.lawService.submitVote(slug, vote)
      .subscribe(
        (data: VoteResponse) => {
          this.getLaw(slug);
          this.getVote(slug);
        },
        err => this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url))
      );
  }

  comment(): void {
    this.submitted = true;

    if (this.commentForm.invalid) {
      return;
    }

    this.lawService.comment(this.law.slug, this.f.comment.value)
      .pipe(first())
      .subscribe(
        data => {
          this.commentForm = this.formBuilder.group({
            comment: ['', Validators.required]
          });
          this.getLaw(this.law.slug);
          return true;
        },
        error => {
          this.submitted = false;
          if (this.f.comment.value.length > 0) {
            this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url));
          }
          this.commentForm = this.formBuilder.group({
            comment: ['', Validators.required]
          });
          return true;
        });
  }

  sortComments() {
    return this.law.comments.sort((a, b) =>
      a.positive > b.positive ? -1 : a.positive === b.positive ? 0 : 1);
  }

  dateComments() {
    return this.law.comments.sort((a, b) =>
      a._id < b._id ? -1 : a._id === b._id ? 0 : 1);
  }

  voteComment(commentId: string, vote: number): void {
    this.lawService.voteComment(this.law.slug, commentId, vote)
      .subscribe(
        (data: any) => {
          this.getLaw(this.law.slug);
      },
        err => this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url))
      );
  }

  shareTwitter(): void {
    if (isPlatformBrowser(this.platformId)) {
      const width = (window.screen.width / 3);
      const height = (window.screen.height / 3);
      window.open('https://twitter.com/intent/tweet?text=' + this.law.headline +
        '. Vota en https://referenda.es.&hashtags=DemocraciaDirecta',
        'twitter', 'width=600, height=300, top=' + height + ', left=' + width + ';');
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
      case 'sumar': {
        width = '69px';
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
      case 'sumar': {
        height = '17px';
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
      default: {
        break;
      }
    }
    return height;
  }

  showComments(): void {
    this.comments = !this.comments;
  }

  showVoterMenu() {
    this.voterMenu = !this.voterMenu;
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

  showMobileCommentsMenu() {
    this.mobileCommentsMenu = !this.mobileCommentsMenu;
  }

  showAddCommentMenu() {
    this.addCommentMenu = !this.addCommentMenu;
  }

  institucionNames(institutions: string[]) {
    const message =  institutions.map(x => this.institutionName(x)).join(", ")
    return message.length == 0 ? "Ninguno" : message
  }

  institutionName(institution: string) {
    switch (institution) {
      case "psoe": return "Partido Socialista Obrero Español";
      case "pp": return "Partido Popular";
      case "vox": return "Vox";
      case "sumar": return "Sumar";
      case "erc": return "Esquerra Republicana de Catalunya";
      case "jpc": return "Junts per Catalunya";
      case "pnv": return "Partido Nacionalista Vasco";
      case "bildu": return "Bildu";
      case "cc": return "Coalición Canaria";
      case "upn": return "Unión del Pueblo Navarro";
      case "bng": return "Bloque Nacionalista Gallego";
      case "gobierno": return "Gobierno de España";
      case "senado": return "Senado de España";
      case "popular": return "Iniciativa legislativa popular";
      case "andalucia": return "Andalucía";
      case "aragon": return "Aragón";
      case "asturias": return "Principado de Asturias";
      case "baleares": return "Illes Balears";
      case "canarias": return "Canarias";
      case "cantabria": return "Cantabria";
      case "castillalamancha": return "Castilla-La Mancha";
      case "castillayleon": return "Castilla y León";
      case "catalunya": return "Catalunya";
      case "extremadura": return "Extremadura";
      case "galicia": return "Galicia";
      case "rioja": return "La Rioja";
      case "madrid": return "Comunidad de Madrid";
      case "murcia": return "Región de Madrid";
      case "navarra": return "Comunidad Foral de Navarra";
      case "paisvasco": return "País Vasco";
      case "valencia": return "Comunidad Valenciana";
      case "ceuta": return "Ceuta";
      case "melilla": return "Melilla";
    }
  }
}
