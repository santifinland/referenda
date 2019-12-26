import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router){}

  ngOnInit() {
  }

  onClick(event) {
    event.preventDefault();
    switch (event.toElement.pathname) {
      case '/aboutus':
        this.router.navigate(['/aboutus']);
        break;
      case '/cookies':
        this.router.navigate(['/cookies']);
        break;
      case '/gdpr':
        this.router.navigate(['/gdpr']);
        break;
      case '/developers':
        this.router.navigate(['/developers']);
        break;
      default:
    }
    return true;
  }
}
