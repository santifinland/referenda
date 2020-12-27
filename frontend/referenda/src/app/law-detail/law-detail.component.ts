import { ActivatedRoute } from '@angular/router';
import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title} from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';

import { Law } from '../_models/law';
import { Comment } from '../_models/comment';
import { LawService } from '../law.service';
import { VoteResponse } from '../_models/vote.response';
import { WINDOW } from '../_services/window.service';


@Component({
  selector: 'app-law-detail',
  templateUrl: './law-detail.component.html',
  styleUrls: ['./law-detail.component.css']
})
export class LawDetailComponent implements OnInit {

  law: Law;
  facebook: string;
  twitter: string;

  position: string;
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
  vote = '';
  comments = false;
  tab = 'all';
  mobile = false;
  voterMenu = false;

  location: string;

  constructor(
      private lawService: LawService,
      private formBuilder: FormBuilder,
      private metaTagService: Meta,
      private route: ActivatedRoute,
      private router: Router,
      private titleService: Title,
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(WINDOW) private window: Window) {
    this.route.params.subscribe( params => this.getLaw(params['slug']));
    this.location = 'https://referenda.es' +  this.router.url;
  }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
    this.position = 'favour';
  }

  get f() { return this.commentForm.controls; }

  getLaw(slug): void {
    this.lawService.getLaw(slug)
      .subscribe(law => {
        const title = law.headline;
        this.titleService.setTitle(title);
        this.metaTagService.updateTag({ name: 'description', content: title });
        law.positiveWidth   = (50 * law.positive   / (law.positive + law.negative + law.abstention)) + '%';
        law.negativeWidth   = (50 * law.negative   / (law.positive + law.negative + law.abstention)) + '%';
        law.abstentionWidth = (50 * law.abstention / (law.positive + law.negative + law.abstention)) + '%';
        this.official_total = law.official_positive + law.official_negative + law.official_abstention;
        console.log(this.official_total)
        if (this.official_total > 0) {
          this.resultsCongreso = true;
        }
        law.officialPositiveWidth   = (50 * law.official_positive   / this.official_total) + '%';
        law.officialNegativeWidth   = (50 * law.official_negative   / this.official_total) + '%';
        law.officialAbstentionWidth = (50 * law.official_abstention / this.official_total) + '%';
        const totalVotes = law.positive + law.negative + law.abstention;
        law.positivePercentage = totalVotes === 0 ? 0 : 100 * law.positive / totalVotes;
        law.negativePercentage = totalVotes === 0 ? 0 : 100 * law.negative / totalVotes;
        law.abstentionPercentage = totalVotes === 0 ? 0 : 100 * law.abstention / totalVotes;
        this.numComments = law.comments.length;
        this.law = law;
        this.facebook = this.facebookPrefix + law.headline + this.facebookSuffix;
        this.dateComments();
        this.mobile = window.innerWidth < 640;
      });
  }

  toggle() {
    this.readMore = !this.readMore;
    if (!this.readMore) {
      window.scroll({top: 0, behavior: 'smooth'});
    }
  }

  submitVote(slug: string, vote: number): void {
    this.lawService.submitVote(slug, vote)
      .subscribe(
        (data: VoteResponse) => { this.getLaw(slug); },
        err => this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url))
      );
  }

  comment(): void {
    this.submitted = true;

    // stop here if form is invalid
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
        (data: any) => { this.getLaw(this.law.slug); },
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
      case 'psoe':       { width = '30px'; break; }
      case 'pp':         { width = '30px'; break; }
      case 'vox':        { width = '50px'; break; }
      case 'podemos':    { width = '69px'; break; }
      case 'ciudadanos': { width = '100px'; break; }
      case 'erc':        { width = '96px'; break; }
      case 'jpc':        { width = '24px'; break; }
      case 'pnv':        { width = '30px'; break; }
      case 'bildu':      { width = '50px'; break; }
      case 'mp':         { width = '36px'; break; }
      case 'cup':        { width = '34px'; break; }
      case 'cc':         { width = '37px'; break; }
      case 'upn':        { width = '49px'; break; }
      case 'bng':        { width = '34px'; break; }
      case 'prc':        { width = '48px'; break; }
      case 'te':         { width = '34px'; break; }
      default: { break; }
    }
    return width;
  }

  logoHeight(party: string): string {
    let height = '30px';
    switch (party) {
      case 'psoe':       { height = '29px'; break; }
      case 'pp':         { height = '30px'; break; }
      case 'vox':        { height = '25px'; break; }
      case 'podemos':    { height = '17px'; break; }
      case 'ciudadanos': { height = '25px'; break; }
      case 'erc':        { height = '19px'; break; }
      case 'jpc':        { height = '23px'; break; }
      case 'pnv':        { height = '30px'; break; }
      case 'bildu':      { height = '19px'; break; }
      case 'mp':         { height = '23px'; break; }
      case 'cup':        { height = '35px'; break; }
      case 'cc':         { height = '35px'; break; }
      case 'upn':        { height = '30px'; break; }
      case 'bng':        { height = '37px'; break; }
      case 'prc':        { height = '15px'; break; }
      case 'te':         { height = '33px'; break; }
      default: { break; }
    }
    return height;
  }

  showComments(): void {
    this.comments = !this.comments;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.mobile = window.innerWidth < 640;
  }

  showVoterMenu() {
    this.voterMenu = !this.voterMenu;
  }
}
