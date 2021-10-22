import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  currentLanguage: string;
  languageList = [
    'en', 'fr'
  ];

  constructor(
    private translate: TranslateService
  ) {
    this.currentLanguage = translate.currentLang;
  }

  ngOnInit() {
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.currentLanguage = language;
  }

}
