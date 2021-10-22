import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigService } from '../services/app-config.service';
import { IAppConfig } from '../models/app-config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  config: IAppConfig;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.config = AppConfigService.settings;

    this.form = this.fb.group({
      email: this.fb.control('', {validators:[Validators.required, Validators.email]}),
      age: this.fb.control('', {validators:[Validators.required, Validators.min(2), Validators.max(100)]}),
      status: this.fb.control('', {validators:[Validators.required]}),
      experience: this.fb.control('', {validators:[Validators.required]}),
      learning: this.fb.control(''),
      instruments: this.fb.control(''),
      practice: this.fb.control(''),
    })
  }

  currentLanguage(): string {
    return this.translate.currentLang;
  }

  submit(): void {

    if(!this.experience()) {
      this.form.controls['learning'].setValue('');
      this.form.controls['instruments'].setValue('');
      this.form.controls['practice'].setValue('');
    }

    if (AppConfigService.settings.difficulty.ask_for_difficulty) {
      this.router.navigate(['/difficulty'], {state: {training: false, form: this.form.value}})
    } else {
      this.router.navigate(['/play'], {state: {training: false, form: this.form.value}})
    }
  }

  experience(): boolean {
    return this.form.controls['experience']?.value !== '' && this.form.controls['experience']?.value !== this.config.form[this.currentLanguage()].musical_experience[0];
  }

}
