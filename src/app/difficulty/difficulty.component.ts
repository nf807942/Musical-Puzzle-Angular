import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConfigService } from '../app-config.service';
import { IAppConfig } from '../models/app-config';

@Component({
  selector: 'app-difficulty',
  templateUrl: './difficulty.component.html',
  styleUrls: ['./difficulty.component.scss']
})
export class DifficultyComponent implements OnInit {

  form: FormGroup;
  config: IAppConfig;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.config = AppConfigService.settings;

    this.form = this.fb.group({
      nb_instruments: this.fb.control(this.config.difficulty.default_instruments, {validators:[Validators.required]}),
      nb_pieces: this.fb.control(this.config.difficulty.default_pieces, {validators:[Validators.required]}),
    })
  }
}
