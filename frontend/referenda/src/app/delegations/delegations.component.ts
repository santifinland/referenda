import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Meta, Title} from '@angular/platform-browser';

import {
  FacebookLoginProvider,
  SocialAuthService,
  SocialUser
} from '@abacritt/angularx-social-login';
import {first} from 'rxjs/operators';
import Swiper from 'swiper';

import {AuthenticationService} from '../_services';
import {Party} from '../_models';
import {User} from '../_models';
import {UserService} from '../_services';
import {DOCUMENT} from "@angular/common";


@Component({
  selector: 'app-delegations',
  templateUrl: './delegations.component.html',
  styleUrls: ['./delegations.component.css']
})
export class DelegationsComponent implements OnInit {

  richSnippets = true;

  currentUser: User;
  currentUserSubscription: Subscription;

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  delegation = 'none';
  delegatedPartyValue: Party;
  delegatedUserValue: User;
  tentativeUser = '';

  findUsersForm: FormGroup;
  submitted = false;
  foundUsers: User[] = [];
  loginForm: FormGroup;
  private socialUser: SocialUser;
  private socialUserLoggedIn: boolean;
  private socialProvider: string = 'Google';  // Default social provider since used the asl-google-signin-button button

  parties: string[] = ['psoe', 'pp', 'vox', 'sumar', 'erc', 'jpc', 'pnv', 'bildu', 'cc', 'upn', 'bng'];


  constructor(
    private authenticationService: AuthenticationService,
    private authService: SocialAuthService,
    private formBuilder: FormBuilder,
    private metaTagService: Meta,
    private router: Router,
    private titleService: Title,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.delegatedParty();
        this.delegatedUser();
      });
      if (this.richSnippets) {
        this.richSnippets = false;
        this.setRichSnippetBreadcrumb()
      }
  }

  ngAfterViewInit() {
    const swiper = new Swiper(this.swiperContainer.nativeElement, {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 4,
      spaceBetween: 20,
      effect: 'slide',
    });
  }

  ngOnInit() {
    const title = 'Delegación de voto en partido político o usuario';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({name: 'description', content: title});
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.findUsersForm = this.formBuilder.group({
      username: ['', [Validators.required]]
    });
    if (this.currentUser && this.currentUser.token) {
      this.delegatedParty();
      this.delegatedUser();
    } else {
    }
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.socialUserLoggedIn = (user != null);
      if (this.socialProvider === 'Google') {
        this.userService.googleRegister(user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token, origin: "google"};
              this.authenticationService.loginWithToken(referendaUser);
            },
            err => console.log(err)
          );
      }
      if (this.socialProvider === 'Facebook') {
        this.userService.facebookRegister(user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token, origin: "facebook"};
              this.authenticationService.loginWithToken(referendaUser);
            },
            err => console.log(err)
          );
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
      '"name": "Delegar Voto", ' +
      '"item": "https://referenda.es/delegar"' +
      '}]' +
      '}';
    const prev = this.document.getElementById('breadcrumb')
    if (prev) {
      prev.remove()
    }
    this.document.getElementsByTagName('head')[0].appendChild(script);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.findUsersForm.controls;
  }

  delegatedParty(): void {
    this.foundUsers = [];
    this.userService.delegatedParty()
      .subscribe(
        (data: any) => {
          if (data) {
            this.delegatedPartyValue = data;
            this.delegation = 'party';
            if (data.name === 'nd') {
              this.delegation = 'none';
            }
          }
        },
        err => {
        }
      );
  }

  delegatedUser(): void {
    this.foundUsers = [];
    this.userService.delegatedUser()
      .subscribe(
        (data: any) => {
          if (data) {
            this.delegatedUserValue = data;
            this.delegation = 'user';
          }
        },
        err => {
        }
      );
  }

  delegateParty(party: string): void {
    this.foundUsers = [];
    this.userService.delegateParty(party).subscribe(
      (data: any) => {
        this.tentativeUser = undefined;
        this.delegatedUserValue = undefined;
        this.findUsersForm.get('username')?.setValue(''); // Access the form control using get() method
        this.findUsersForm.reset();
        this.delegatedParty();
      },
      (err) => {
        this.router.navigateByUrl('login?returnUrl=' + encodeURI(this.router.url));
      }
    );
  }

  findUsers() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.findUsersForm.invalid) {
      return;
    }

    this.userService.findUser(this.f.username.value)
      .subscribe(
        data => {
          this.foundUsers = data;
        },
        error => {
          this.submitted = false;
        });
  }

  delegateUser(): void {
    this.userService.delegateUser(this.tentativeUser)
      .subscribe(
        (data: any) => {
          this.tentativeUser = undefined;
          this.delegatedPartyValue = undefined;
          this.delegatedUser();
        },
        err => {
        }
      );
  }

  removeDelegations(): void {
    this.delegation = 'none';
    this.tentativeUser = '';
    this.submitted = false;
    this.findUsersForm.setValue({'username': ''});
    this.findUsersForm.reset();
    this.foundUsers = [];
    this.delegatedUserValue = undefined;
    this.delegateParty('nd');
  }

  setTentativeUser(username: string): void {
    this.foundUsers = [];
    this.submitted = false;
    this.tentativeUser = username;
    this.findUsersForm.setValue({'username': username});
  }

  get lf() {
    return this.loginForm.controls;
  }

  placeholder() {
    if (this.delegatedUserValue) {
      return this.delegatedUserValue.username;
    } else {
      return 'Buscar usuario (al menos 4 caracteres)';
    }
  }

  reset(): void {
    this.delegation = 'none';
    this.tentativeUser = '';
    this.submitted = false;
    this.findUsersForm.setValue({'username': ''});
    this.findUsersForm.reset();
    this.foundUsers = [];
    this.delegatedUser();
  }

  onLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService.login(this.lf.username.value, this.lf.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.findUsersForm.reset();
          this.submitted = false;
        },
        error => {
          this.submitted = false;
          this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
          });
          return true;
        });
  }

  signInWithFB(): void {
    this.socialProvider = 'Facebook';
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logoWidth(party: string): string {
    let width = '30px';
    switch (party) {
      case 'psoe': {
        width = '95px';
        break;
      }
      case 'pp': {
        width = '64px';
        break;
      }
      case 'vox': {
        width = '90px';
        break;
      }
      case 'sumar': {
        width = '185px';
        break;
      }
      case 'erc': {
        width = '257px';
        break;
      }
      case 'jpc': {
        width = '64px';
        break;
      }
      case 'pnv': {
        width = '80px';
        break;
      }
      case 'bildu': {
        width = '134px';
        break;
      }
      case 'cc': {
        width = '99px';
        break;
      }
      case 'upn': {
        width = '131px';
        break;
      }
      case 'bng': {
        width = '91px';
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
        height = '91px';
        break;
      }
      case 'pp': {
        height = '64px';
        break;
      }
      case 'vox': {
        height = '45px';
        break;
      }
      case 'sumar': {
        height = '45px';
        break;
      }
      case 'erc': {
        height = '50px';
        break;
      }
      case 'jpc': {
        height = '61px';
        break;
      }
      case 'pnv': {
        height = '80px';
        break;
      }
      case 'bildu': {
        height = '50px';
        break;
      }
      case 'cc': {
        height = '93px';
        break;
      }
      case 'upn': {
        height = '80px';
        break;
      }
      case 'bng': {
        height = '99px';
        break;
      }
      default: {
        break;
      }
    }
    return height;
  }

  logoMobileWidth(party: string): string {
    let width = '30px';
    switch (party) {
      case 'psoe': {
        width = '53px';
        break;
      }
      case 'pp': {
        width = '44px';
        break;
      }
      case 'vox': {
        width = '62px';
        break;
      }
      case 'sumar': {
        width = '99px';
        break;
      }
      case 'erc': {
        width = '88px';
        break;
      }
      case 'jpc': {
        width = '50px';
        break;
      }
      case 'pnv': {
        width = '50px';
        break;
      }
      case 'bildu': {
        width = '89px';
        break;
      }
      case 'cc': {
        width = '51px';
        break;
      }
      case 'upn': {
        width = '93px';
        break;
      }
      case 'bng': {
        width = '53px';
        break;
      }
      default: {
        break;
      }
    }
    return width;
  }

  logoMobileHeight(party: string): string {
    let height = '30px';
    switch (party) {
      case 'psoe': {
        height = '51px';
        break;
      }
      case 'pp': {
        height = '44px';
        break;
      }
      case 'vox': {
        height = '31px';
        break;
      }
      case 'sumar': {
        height = '25px';
        break;
      }
      case 'erc': {
        height = '16px';
        break;
      }
      case 'jpc': {
        height = '48px';
        break;
      }
      case 'pnv': {
        height = '50px';
        break;
      }
      case 'bildu': {
        height = '34px';
        break;
      }
      case 'cc': {
        height = '48x';
        break;
      }
      case 'upn': {
        height = '56px';
        break;
      }
      case 'bng': {
        height = '58px';
        break;
      }
      default: {
        break;
      }
    }
    return height;
  }
}
