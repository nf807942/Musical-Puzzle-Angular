import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Material Component Modules
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';

// Custom Components
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PlayComponent } from './play/play.component';
import { PrincipeComponent } from './principe/principe.component';
import { FooterComponent } from './commons/footer/footer.component';
import { ToolbarComponent } from './commons/toolbar/toolbar.component';
import { FormComponent } from './form/form.component';
import { DifficultyComponent } from './difficulty/difficulty.component';
import { ResultDialogComponent } from './commons/dialogs/result-dialog/result-dialog.component';
import { AdminComponent } from './admin/base/admin.component';
import { AdminResultsComponent } from './admin/admin-results/admin-results.component';
import { AdminTracksComponent } from './admin/admin-tracks/admin-tracks.component';
import { AdminConfigComponent } from './admin/admin-config/admin-config.component';

// Custom Services
import { AppConfigService } from './services/app-config.service';
import { ResultService } from './services/result.service';

// Initialize the app by loading the config file
export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}

// Loading the translator
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PlayComponent,
    PrincipeComponent,
    FooterComponent,
    ToolbarComponent,
    FormComponent,
    DifficultyComponent,
    ResultDialogComponent,
    AdminComponent,
    AdminResultsComponent,
    AdminTracksComponent,
    AdminConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule,

    // Material Component Modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSliderModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,

    // Traduction Module
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [
    ResultService,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], 
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
