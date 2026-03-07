import { HammerModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import * as Hammer from 'hammerjs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkillIconsComponent } from './components/skill-icons/skill-icons.component';
import { ContactComponent } from './components/contact/contact.component';
import { IntroComponent } from './components/intro/intro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CareerComponent } from './components/career/career.component';
import { PortfolioSkillsComponent } from "./components/skill-section/skill-section.component";
import { BriefComponent } from './components/brief/brief.component';

export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL }, // Enable all swipe directions
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SkillIconsComponent,
    ContactComponent,
    IntroComponent,
    CareerComponent
  ],
  imports: [
    MatButtonToggleModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HammerModule,
    PortfolioSkillsComponent,
    BriefComponent
],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
