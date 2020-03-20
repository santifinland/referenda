import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';
import { Law } from '../_models/law';
import { LawService } from '../law.service';
import { User } from '../_models';


@Component({
  selector: 'admin-law',
  templateUrl: './admin-law.component.html',
  styleUrls: ['./admin-law.component.css']
})
export class AdminLawComponent implements OnInit {

  law: Law;
  currentUser: User;
  currentUserSubscription: Subscription;
  lawForm: FormGroup;
  submitted = false;

  constructor(
      private alertService: AlertService,
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private lawService: LawService,
      private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.getLaw(params['slug']));
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.lawForm = this.formBuilder.group({
      law_type: ['', [Validators.required]],
      institution: ['', [Validators.required]],
      tier: [1, [Validators.required]],
      featured: ['', [Validators.required]],
      headline: ['', [Validators.required]],
      short_description: ['', [Validators.required]],
      long_description: ['', [Validators.required]],
      link: ['', [Validators.required]],
      pub_date: ['2020-01-01T00:00:00Z', [Validators.required]],
      vote_start: ['2020-01-01T00:00:00Z', [Validators.required]],
      vote_end: ['2030-01-01T00:00:00Z', [Validators.required]],
      psoe: [0, []],
      pp: [0, []],
      vox: [0, []],
      podemos: [0, []],
      ciudadanos: [0, []],
      erc: [0, []],
      jpc: [0, []],
      pnv: [0, []],
      bildu: [0, []],
      mp: [0, []],
      cup: [0, []],
      cc: [0, []],
      upn: [0, []],
      bng: [0, []],
      prc: [0, []],
      te: [0, []],
      official_positive: [0, [Validators.required]],
      official_negative: [0, [Validators.required]],
      official_abstention: [0, [Validators.required]],
    });
  }


  get lf() { return this.lawForm.controls; }

  getLaw(slug): void {
    this.lawService.getLaw(slug)
      .subscribe(law => {
        this.law = law;
        this.law.slug = slug;
        this.lawForm.controls.law_type.setValue(law.law_type);
        this.lawForm.controls.institution.setValue(law.institution);
        this.lawForm.controls.tier.setValue(law.tier);
        this.lawForm.controls.featured.setValue(law.featured);
        this.lawForm.controls.headline.setValue(law.headline);
        this.lawForm.controls.short_description.setValue(law.short_description);
        this.lawForm.controls.long_description.setValue(law.long_description);
        this.lawForm.controls.link.setValue(law.link);
        this.lawForm.controls.pub_date.setValue(law.pub_date);
        this.lawForm.controls.vote_start.setValue(law.vote_start);
        this.lawForm.controls.vote_end.setValue(law.vote_end);
        this.lawForm.controls.psoe.setValue(this.getPosition('psoe'));
        this.lawForm.controls.pp.setValue(this.getPosition('pp'));
        this.lawForm.controls.vox.setValue(this.getPosition('vox'));
        this.lawForm.controls.podemos.setValue(this.getPosition('podemos'));
        this.lawForm.controls.ciudadanos.setValue(this.getPosition('ciudadanos'));
        this.lawForm.controls.erc.setValue(this.getPosition('erc'));
        this.lawForm.controls.jpc.setValue(this.getPosition('jpc'));
        this.lawForm.controls.pnv.setValue(this.getPosition('pnv'));
        this.lawForm.controls.bildu.setValue(this.getPosition('bildu'));
        this.lawForm.controls.mp.setValue(this.getPosition('mp'));
        this.lawForm.controls.cup.setValue(this.getPosition('cup'));
        this.lawForm.controls.cc.setValue(this.getPosition('cc'));
        this.lawForm.controls.upn.setValue(this.getPosition('upn'));
        this.lawForm.controls.bng.setValue(this.getPosition('bng'));
        this.lawForm.controls.prc.setValue(this.getPosition('prc'));
        this.lawForm.controls.te.setValue(this.getPosition('te'));
        this.lawForm.controls.official_positive.setValue(law.official_positive);
        this.lawForm.controls.official_negative.setValue(law.official_negative);
        this.lawForm.controls.official_abstention.setValue(law.official_abstention);
      });
  }

  isPositive(party) {
    if (this.law.positiveParties.includes(party)) return 1;
    return 0
  }

  isNegative(party) {
    if (this.law.negativeParties.includes(party)) return 1;
    return 0
  }

  isAbstention(party) {
    if (this.law.abstentionParties.includes(party)) return 1;
    return 0
  }

  getPosition(party) {
    if (this.law.positiveParties.includes(party)) return 'Yes';
    if (this.law.negativeParties.includes(party)) return 'No';
    return 'Abstention'
  }


  onSubmit() {
    this.submitted = true;
    console.log('Sending Law')

    if (this.lawForm.invalid) {
      console.log('Invalid form')
      return;
    }

    let law = this.lawForm.value
    console.log(law);
    law.slug = this.law.slug;
    law.tier = parseInt(law.tier);
    law.featured = law.featured == 'true' ? true : false;
    console.log(law.featured);
    law.official_positive = parseInt(law.official_positive);
    law.official_negative = parseInt(law.official_negative);
    law.official_abstention = parseInt(law.official_abstention);
	  law.positiveParties = [];
	  law.negativeParties = [];
	  law.abstentionParties = [];

	  // PP
    if (law.pp == 'Yes') {
        law.positiveParties.push("pp");
    } else if (law.pp == 'No') {
        law.negativeParties.push("pp");
    } else {
        law.abstentionParties.push("pp");
    }
    // Psoe
    if (law.psoe == 'Yes') {
      law.positiveParties.push("psoe");
    } else if (law.psoe == 'No') {
        law.negativeParties.push("psoe");
    } else {
        law.abstentionParties.push("psoe");
    }
    // Podemos
    if (law.podemos == 'Yes') {
        law.positiveParties.push("podemos");
    } else if (law.podemos == 'No') {
        law.negativeParties.push("podemos");
    } else {
        law.abstentionParties.push("podemos");
    }
    // Ciudada'No's
    if (law.ciudadanos == 'Yes') {
        law.positiveParties.push("ciudadanos");
    } else if (law.ciudadanos == 'No') {
        law.negativeParties.push("ciudadanos");
    } else {
        law.abstentionParties.push("ciudadanos");
    }
    // Erc
    if (law.erc == 'Yes') {
        law.positiveParties.push("erc");
    } else if (law.erc == 'No') {
        law.negativeParties.push("erc");
    } else {
        law.abstentionParties.push("erc");
    }
    // Pnv
    if (law.pnv == 'Yes') {
        law.positiveParties.push("pnv");
    } else if (law.pnv == 'No') {
        law.negativeParties.push("pnv");
    } else {
        law.abstentionParties.push("pnv");
    }
    // Mas pais
    if (law.mp == 'Yes') {
        law.positiveParties.push("mp");
    } else if (law.mp == 'No') {
        law.negativeParties.push("mp");
    } else {
        law.abstentionParties.push("mp");
    }
    // Coalicion Canaria
    if (law.cc == 'Yes') {
        law.positiveParties.push("cc");
    } else if (law.cc == 'No') {
        law.negativeParties.push("cc");
    } else {
        law.abstentionParties.push("cc");
    }
    // Vox
    if (law.vox == 'Yes') {
        law.positiveParties.push("vox");
    } else if (law.vox == 'No') {
        law.negativeParties.push("vox");
    } else {
        law.abstentionParties.push("vox");
    }
    // Partido Regionalista Cantabro
    if (law.prc == 'Yes') {
        law.positiveParties.push("prc");
    } else if (law.prc == 'No') {
        law.negativeParties.push("prc");
    } else {
        law.abstentionParties.push("prc");
    }
    // Navarra suma
    if (law.upn == 'Yes') {
        law.positiveParties.push("upn");
    } else if (law.upn == 'No') {
        law.negativeParties.push("upn");
    } else {
        law.abstentionParties.push("upn");
    }
    // Bildu
    if (law.bildu == 'Yes') {
        law.positiveParties.push("bildu");
    } else if (law.bildu == 'No') {
        law.negativeParties.push("bildu");
    } else {
        law.abstentionParties.push("bildu");
    }
    // Junts per cat
    if (law.jpc == 'Yes') {
        law.positiveParties.push("jpc");
    } else if (law.jpc == 'No') {
        law.negativeParties.push("jpc");
    } else {
        law.abstentionParties.push("jpc");
    }
    // Teruel Existe
    if (law.te == 'Yes') {
        law.positiveParties.push("te");
    } else if (law.te == 'No') {
        law.negativeParties.push("te");
    } else {
        law.abstentionParties.push("te");
    }
    // CUP
    if (law.cup == 'Yes') {
        law.positiveParties.push("cup");
    } else if (law.cup == 'No') {
        law.negativeParties.push("cup");
    } else {
        law.abstentionParties.push("cup");
    }
    // BNG
    if (law.bng == 'Yes') {
        law.positiveParties.push("bng");
    } else if (law.bng == 'No') {
        law.negativeParties.push("bng");
    } else {
        law.abstentionParties.push("bng");
    }

    this.lawService.putLaw(law)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Law created.', true);
        },
        error => {
          this.alertService.error(error);
        });
  }

}
