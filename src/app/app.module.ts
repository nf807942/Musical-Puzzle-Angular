import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material Component Modules
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

// Custom Component
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TrainingComponent } from './training/training.component';
import { PlayComponent } from './play/play.component';
import { PrincipeComponent } from './principe/principe.component';
import { FooterComponent } from './commons/footer/footer.component';
import { ToolbarComponent } from './commons/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    TrainingComponent,
    PlayComponent,
    PrincipeComponent,
    FooterComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,

    // Material Component Modules
    MatToolbarModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
