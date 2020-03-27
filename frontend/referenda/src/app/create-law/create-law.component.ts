import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';
import { LawService } from '../law.service';
import { User } from '../_models';


@Component({
  selector: 'create-law',
  templateUrl: './create-law.component.html',
  styleUrls: ['./create-law.component.css']
})
export class CreateLawComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;
  lawForm: FormGroup;
  submitted = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  constructor(
      private alertService: AlertService,
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private lawService: LawService) {
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
      te: [0, []]
    });
  }


  get lf() { return this.lawForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log('Sending Law')

    if (this.lawForm.invalid) {
      console.log('Invalid form')
      return;
    }

    let law = this.lawForm.value
    law.tier = parseInt(law.tier)
    law.featured = law.featured == 'True' ? true : false;
    law.positive = 0
    law.negative = 0
    law.abstention = 0
    law.official_positive = 0
    law.official_negative = 0
    law.official_abstention = 0

    // PP
    if (law.pp == 'Yes') {
      law.pp = 1
    } else if (law.pp == 'No') {
      law.pp = 2
    } else {
      law.pp = 3
    }
    // Psoe
    if (law.psoe == 'Yes') {
      law.psoe = 1
    } else if (law.psoe == 'No') {
      law.psoe = 2
    } else {
      law.psoe = 3
    }
    // Podemos
    if (law.podemos == 'Yes') {
      law.podemos = 1
    } else if (law.podemos == 'No') {
      law.podemos = 2
    } else {
      law.podemos = 3
    }
    // Ciudada'No's
    if (law.ciudadanos == 'Yes') {
      law.ciudadanos = 1
    } else if (law.ciudadanos == 'No') {
      law.ciudadanos = 2
    } else {
      law.ciudadanos = 3
    }
    // Erc
    if (law.erc == 'Yes') {
      law.erc = 1
    } else if (law.erc == 'No') {
      law.erc = 2
    } else {
      law.erc = 3
    }
    // Pnv
    if (law.pnv == 'Yes') {
      law.pnv = 1
    } else if (law.pnv == 'No') {
      law.pnv = 2
    } else {
      law.pnv = 3
    }
    // Mas pais
    if (law.mp == 'Yes') {
      law.mp = 1
    } else if (law.mp == 'No') {
      law.mp = 2
    } else {
      law.mp = 3
    }
    // Coalicion Canaria
    if (law.cc == 'Yes') {
      law.cc = 1
    } else if (law.cc == 'No') {
      law.cc = 2
    } else {
      law.cc = 3
    }
    // Vox
    if (law.vox == 'Yes') {
      law.vox = 1
    } else if (law.vox == 'No') {
      law.vox = 2
    } else {
      law.vox = 3
    }
    // Partido Regionalista Cantabro
    if (law.prc == 'Yes') {
      law.prc = 1
    } else if (law.prc == 'No') {
      law.prc = 2
    } else {
      law.prc = 3
    }
    // Navarra suma
    if (law.upn == 'Yes') {
      law.upn = 1
    } else if (law.upn == 'No') {
      law.upn = 2
    } else {
      law.upn = 3
    }
    // Bildu
    if (law.bildu == 'Yes') {
      law.bildu = 1
    } else if (law.bildu == 'No') {
      law.bildu = 2
    } else {
      law.bildu = 3
    }
    // Junts per cat
    if (law.jpc == 'Yes') {
      law.jpc = 1
    } else if (law.jpc == 'No') {
      law.jpc = 2
    } else {
      law.jpc = 3
    }
    // Teruel Existe
    if (law.te == 'Yes') {
      law.te = 1
    } else if (law.te == 'No') {
      law.te = 2
    } else {
      law.te = 3
    }
    // CUP
    if (law.cup == 'Yes') {
      law.cup = 1
    } else if (law.cup == 'No') {
      law.cup = 2
    } else {
      law.cup = 3
    }
    // BNG
    if (law.bng == 'Yes') {
      law.bng = 1
    } else if (law.bng == 'No') {
      law.bng = 2
    } else {
      law.bng = 3
    }







    law.psoe = parseInt(law.psoe)
    law.pp = parseInt(law.pp)
	  law.vox = parseInt(law.vox)
	  law.podemos = parseInt(law.podemos)
	  law.ciudadanos = parseInt(law.ciudadanos)
	  law.erc = parseInt(law.erc)
	  law.jpc = parseInt(law.jpc)
	  law.pnv = parseInt(law.pnv)
	  law.bildu = parseInt(law.bildu)
	  law.mp = parseInt(law.mp)
	  law.cup = parseInt(law.cup)
	  law.cc = parseInt(law.cc)
	  law.upn = parseInt(law.upn)
	  law.bng = parseInt(law.bng)
	  law.prc = parseInt(law.prc)
	  law.te = parseInt(law.te)

    this.lawService.postLaw(law)
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
