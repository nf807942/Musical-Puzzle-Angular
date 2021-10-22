import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from './services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'musical-puzzle-angular';

  constructor(translate: TranslateService) {
    translate.setDefaultLang(AppConfigService.settings.language.default_language);
    translate.use(AppConfigService.settings.language.default_language);
  }
}
