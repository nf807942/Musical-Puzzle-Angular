import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';

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

// Custom Components
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TrainingComponent } from './training/training.component';
import { PlayComponent } from './play/play.component';
import { PrincipeComponent } from './principe/principe.component';
import { FooterComponent } from './commons/footer/footer.component';
import { ToolbarComponent } from './commons/toolbar/toolbar.component';
import { FormComponent } from './form/form.component';
import { DifficultyComponent } from './difficulty/difficulty.component';

// Custom Services
import { AppConfigService } from './app-config.service';
import { ResultDialogComponent } from './commons/dialogs/result-dialog/result-dialog.component';

// Initialize the app by loading the config file
export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    TrainingComponent,
    PlayComponent,
    PrincipeComponent,
    FooterComponent,
    ToolbarComponent,
    FormComponent,
    DifficultyComponent,
    ResultDialogComponent
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
  ],
  providers: [
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
