import { ActivatedRoute } from '@angular/router';
import { Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Law } from '../_models/law';
import { LawService } from '../law.service';
import { ModalService } from '../_services';
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

  resultsCongreso = false;

  message: String = 'Cargando...';
  private facebookPrefix = 'https://www.facebook.com/sharer/sharer.php?u=';
  private facebookSuffix = '%2F&amp;src=sdkpreparse';

  commentForm: FormGroup;
  submitted = false;

  location: string;

  constructor(
      private lawService: LawService,
      private formBuilder: FormBuilder,
      private modalService: ModalService,
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
      comment: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  get f() { return this.commentForm.controls; }

  getLaw(slug): void {
    this.lawService.getLaw(slug)
      .subscribe(law => {
        const title = law.headline;
        this.titleService.setTitle(title);
        document.querySelector('meta[name="description"]').setAttribute('content', title);
        law.positiveWidth   = (50 * law.positive   / (law.positive + law.negative + law.abstention)) + '%';
        law.negativeWidth   = (50 * law.negative   / (law.positive + law.negative + law.abstention)) + '%';
        law.abstentionWidth = (50 * law.abstention / (law.positive + law.negative + law.abstention)) + '%';
        const official_total = law.official_positive + law.official_negative + law.official_abstention;
        if (official_total > 0) {
          this.resultsCongreso = true;
        }
        law.officialPositiveWidth   = (50 * law.official_positive   / official_total) + '%';
        law.officialNegativeWidth   = (50 * law.official_negative   / official_total) + '%';
        law.officialAbstentionWidth = (50 * law.official_abstention / official_total) + '%';
        this.law = law;
        this.facebook = this.facebookPrefix + law.headline + this.facebookSuffix;
      });
  }

  submitVote(slug: string, vote: number): void {
    this.lawService.submitVote(slug, vote)
      .subscribe(
        (data: VoteResponse) => { this.getLaw(slug); },
        err => this.modalService.open('login')
      );
  }

  comment(c: string): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.commentForm.invalid) {
      return;
    }

    this.lawService.comment(this.law.slug, this.f.comment.value)
      .pipe(first())
      .subscribe(
        data => {
          this.getLaw(this.law.slug);
        },
        error => {
          this.submitted = false;
          if (this.f.comment.value.length > 0) {
            this.modalService.open('login');
          }
          this.commentForm = this.formBuilder.group({
            comment: ['', Validators.required]
          });
          return true;
        });
  }

  voteComment(commentId: string, vote: number): void {
    this.lawService.voteComment(this.law.slug, commentId, vote)
      .subscribe(
        (data: any) => { this.getLaw(this.law.slug); },
        err => this.modalService.open('login')
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
}
