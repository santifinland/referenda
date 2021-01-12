import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';
import { Law } from '../_models/law';
import { LawService } from '../_services/law.service';
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
      [],
      ['fontSize']
    ]
  };

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
        this.lawForm.controls.tier.setValue(law.tier);
        this.lawForm.controls.institution_psoe.setValue((this.law.institution.includes('psoe')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_pp.setValue((this.law.institution.includes('pp')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_vox.setValue((this.law.institution.includes('vox')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_podemos.setValue((this.law.institution.includes('podemos')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_ciudadanos.setValue((this.law.institution.includes('ciudadanos')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_erc.setValue((this.law.institution.includes('erc')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_jpc.setValue((this.law.institution.includes('jpc')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_pnv.setValue((this.law.institution.includes('pnv')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_bildu.setValue((this.law.institution.includes('bildu')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_mp.setValue((this.law.institution.includes('mp')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_cup.setValue((this.law.institution.includes('cup')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_cc.setValue((this.law.institution.includes('cc')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_upn.setValue((this.law.institution.includes('upn')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_bng.setValue((this.law.institution.includes('bng')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_prc.setValue((this.law.institution.includes('prc')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_te.setValue((this.law.institution.includes('te')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_andalucia.setValue((this.law.institution.includes('andalucia')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_aragon.setValue((this.law.institution.includes('aragon')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_asturias.setValue((this.law.institution.includes('asturias')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_baleares.setValue((this.law.institution.includes('baleares')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_canarias.setValue((this.law.institution.includes('canarias')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_cantabria.setValue((this.law.institution.includes('cantabria')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_mancha.setValue((this.law.institution.includes('mancha')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_leon.setValue((this.law.institution.includes('leon')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_catalunya.setValue((this.law.institution.includes('catalunya')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_extremadura.setValue((this.law.institution.includes('extremadura')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_galicia.setValue((this.law.institution.includes('galicia')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_rioja.setValue((this.law.institution.includes('rioja')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_madrid.setValue((this.law.institution.includes('madrid')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_murcia.setValue((this.law.institution.includes('murcia')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_navarra.setValue((this.law.institution.includes('navarra')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_vasco.setValue((this.law.institution.includes('vasco')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_valencia.setValue((this.law.institution.includes('valencia')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_ceuta.setValue((this.law.institution.includes('ceuta')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_melilla.setValue((this.law.institution.includes('melilla')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_gobierno.setValue((this.law.institution.includes('gobierno')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_senado.setValue((this.law.institution.includes('senado')) ? 'Yes' : 'No');
        this.lawForm.controls.institution_popular.setValue((this.law.institution.includes('popular')) ? 'Yes' : 'No');
        this.lawForm.controls.educacion.setValue((this.law.area.includes('educacion')) ? 'Yes' : 'No');
        this.lawForm.controls.sanidad.setValue((this.law.area.includes('sanidad')) ? 'Yes' : 'No');
        this.lawForm.controls.economia.setValue((this.law.area.includes('economia')) ? 'Yes' : 'No');
        this.lawForm.controls.justicia.setValue((this.law.area.includes('justicia')) ? 'Yes' : 'No');
        this.lawForm.controls.exteriores.setValue((this.law.area.includes('exteriores')) ? 'Yes' : 'No');
        this.lawForm.controls.defensa.setValue((this.law.area.includes('defensa')) ? 'Yes' : 'No');
        this.lawForm.controls.interior.setValue((this.law.area.includes('interior')) ? 'Yes' : 'No');
        this.lawForm.controls.agricultura.setValue((this.law.area.includes('agri')) ? 'Yes' : 'No');
        this.lawForm.controls.infraestructuras.setValue((this.law.area.includes('infraestructuras')) ? 'Yes' : 'No');
        this.lawForm.controls.cultura.setValue((this.law.area.includes('cultura')) ? 'Yes' : 'No');
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
	  law.institution = [];
	  law.area = [];
    law.featured = law.featured == 'true' ? true : false;
    console.log(law.featured);
    law.official_positive = parseInt(law.official_positive);
    law.official_negative = parseInt(law.official_negative);
    law.official_abstention = parseInt(law.official_abstention);
	  law.positiveParties = [];
	  law.negativeParties = [];
	  law.abstentionParties = [];

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
