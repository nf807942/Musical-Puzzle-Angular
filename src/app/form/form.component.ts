import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '../app-config.service';
import { IAppConfig } from '../models/app-config';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  config: IAppConfig;

  constructor(
    private fb: FormBuilder
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

  next_page(): string {
    if (AppConfigService.settings.difficulty.ask_for_difficulty) {
      return '/difficulty';
    }
    return '/play';
  }

}
