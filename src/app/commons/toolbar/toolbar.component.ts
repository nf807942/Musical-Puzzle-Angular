import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  currentLanguage: string;
  languageList: string[];

  constructor(
    private translate: TranslateService
  ) {
    this.currentLanguage = translate.currentLang;
    this.languageList = AppConfigService.settings.language.available_languages;
  }

  ngOnInit() {
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.currentLanguage = language;
  }

}
