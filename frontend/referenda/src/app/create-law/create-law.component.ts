import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';
import { LawService } from '../_services/law.service';
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
      institution_psoe: [0, []],
      institution_pp: [0, []],
      institution_vox: [0, []],
      institution_podemos: [0, []],
      institution_ciudadanos: [0, []],
      institution_erc: [0, []],
      institution_jpc: [0, []],
      institution_pnv: [0, []],
      institution_bildu: [0, []],
      institution_mp: [0, []],
      institution_cup: [0, []],
      institution_cc: [0, []],
      institution_upn: [0, []],
      institution_bng: [0, []],
      institution_prc: [0, []],
      institution_te: [0, []],
      institution_andalucia: [0, []],
      institution_aragon: [0, []],
      institution_asturias: [0, []],
      institution_baleares: [0, []],
      institution_canarias: [0, []],
      institution_cantabria: [0, []],
      institution_mancha: [0, []],
      institution_leon: [0, []],
      institution_catalunya: [0, []],
      institution_extremadura: [0, []],
      institution_galicia: [0, []],
      institution_rioja: [0, []],
      institution_madrid: [0, []],
      institution_murcia: [0, []],
      institution_navarra: [0, []],
      institution_vasco: [0, []],
      institution_valencia: [0, []],
      institution_ceuta: [0, []],
      institution_melilla: [0, []],
      institution_gobierno: [0, []],
      institution_senado: [0, []],
      institution_popular: [0, []],
      tier: [1, [Validators.required]],
      educacion: [0, []],
      sanidad: [0, []],
      economia: [0, []],
      justicia: [0, []],
      exteriores: [0, []],
      defensa: [0, []],
      interior: [0, []],
      agricultura: [0, []],
      infraestructuras: [0, []],
      cultura: [0, []],
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
	  law.institution = [];
	  law.area = [];
    law.featured = law.featured == 'True' ? true : false;
    law.positive = 0
    law.negative = 0
    law.abstention = 0
    law.official_positive = 0
    law.official_negative = 0
    law.official_abstention = 0

    if (law.institution_psoe == 'Yes') {
      law.institution.push("psoe");
    }
    if (law.institution_pp == 'Yes') {
      law.institution.push("pp");
    }
    if (law.institution_vox == 'Yes') {
      law.institution.push("vox");
    }
    if (law.institution_podemos == 'Yes') {
      law.institution.push("podemos");
    }
    if (law.institution_ciudadanos == 'Yes') {
      law.institution.push("ciudadanos");
    }
    if (law.institution_erc == 'Yes') {
      law.institution.push("erc");
    }
    if (law.institution_jpc == 'Yes') {
      law.institution.push("jpc");
    }
    if (law.institution_pnv == 'Yes') {
      law.institution.push("pnv");
    }
    if (law.institution_bildu == 'Yes') {
      law.institution.push("bildu");
    }
    if (law.institution_mp == 'Yes') {
      law.institution.push("mp");
    }
    if (law.institution_cup == 'Yes') {
      law.institution.push("cup");
    }
    if (law.institution_cc == 'Yes') {
      law.institution.push("cc");
    }
    if (law.institution_upn == 'Yes') {
      law.institution.push("upn");
    }
    if (law.institution_bng == 'Yes') {
      law.institution.push("bng");
    }
    if (law.institution_prc == 'Yes') {
      law.institution.push("prc");
    }
    if (law.institution_te == 'Yes') {
      law.institution.push("te");
    }
    if (law.institution_gobierno == 'Yes') {
      law.institution.push("gobierno");
    }
    if (law.institution_senado == 'Yes') {
      law.institution.push("senado");
    }
    if (law.institution_popular == 'Yes') {
      law.institution.push("popular");
    }
    if (law.institution_andalucia == 'Yes') {
      law.institution.push("andalucia");
    }
    if (law.institution_aragon == 'Yes') {
      law.institution.push("aragon");
    }
    if (law.institution_asturias == 'Yes') {
      law.institution.push("asturias");
    }
    if (law.institution_baleares == 'Yes') {
      law.institution.push("baleares");
    }
    if (law.institution_canarias == 'Yes') {
      law.institution.push("canarias");
    }
    if (law.institution_cantabria == 'Yes') {
      law.institution.push("cantabria");
    }
    if (law.institution_mancha == 'Yes') {
      law.institution.push("mancha");
    }
    if (law.institution_leon == 'Yes') {
      law.institution.push("leon");
    }
    if (law.institution_catalunya == 'Yes') {
      law.institution.push("catalunya");
    }
    if (law.institution_extremadura == 'Yes') {
      law.institution.push("extremadura");
    }
    if (law.institution_galicia == 'Yes') {
      law.institution.push("galicia");
    }
    if (law.institution_rioja == 'Yes') {
      law.institution.push("rioja");
    }
    if (law.institution_murcia == 'Yes') {
      law.institution.push("murcia");
    }
    if (law.institution_madrid == 'Yes') {
      law.institution.push("madrid");
    }
    if (law.institution_navarra == 'Yes') {
      law.institution.push("navarra");
    }
    if (law.institution_vasco == 'Yes') {
      law.institution.push("vasco");
    }
    if (law.institution_valencia == 'Yes') {
      law.institution.push("valencia");
    }
    if (law.institution_ceuta == 'Yes') {
      law.institution.push("ceuta");
    }
    if (law.institution_melilla == 'Yes') {
      law.institution.push("melilla");
    }

    if (law.educacion == 'Yes') {
      law.area.push("educacion");
    }
    if (law.sanidad == 'Yes') {
      law.area.push("sanidad");
    }
    if (law.economia == 'Yes') {
      law.area.push("economia");
    }
    if (law.justicia == 'Yes') {
      law.area.push("justicia");
    }
    if (law.exteriores == 'Yes') {
      law.area.push("exteriores");
    }
    if (law.defensa == 'Yes') {
      law.area.push("defensa");
    }
    if (law.interior == 'Yes') {
      law.area.push("interior");
    }
    if (law.agricultura == 'Yes') {
      law.area.push("agri");
    }
    if (law.infraestructuras == 'Yes') {
      law.area.push("infraestructuras");
    }
    if (law.cultura == 'Yes') {
      law.area.push("cultura");
    }

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
