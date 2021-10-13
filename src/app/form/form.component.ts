import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: this.fb.control('', {validators:[Validators.required, Validators.email]}),
      age: this.fb.control('', {validators:[Validators.required, Validators.min(2), Validators.max(100)]}),
      statut: this.fb.control('', {validators:[Validators.required]}),
      experience: this.fb.control('', {validators:[Validators.required]}),
      apprentissage: this.fb.control(''),
      instruments: this.fb.control(''),
      pratique: this.fb.control(''),
    })
  }

  next_page(): string {
    if (AppConfigService.settings.difficulty.ask_for_difficulty) {
      return '/difficulty';
    }
    return '/play';
  }

}
