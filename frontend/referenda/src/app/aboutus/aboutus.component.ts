import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    const title = 'Referenda. Democracia Directa';
    this.titleService.setTitle(title);
    document.querySelector('meta[name="description"]').setAttribute('content', title);
  }

}
