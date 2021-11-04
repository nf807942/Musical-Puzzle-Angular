import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NumberDialogComponent } from 'src/app/commons/dialogs/number-dialog/number-dialog.component';
import { IAppConfig } from 'src/app/models/app-config';
import { AppConfigService } from 'src/app/services/app-config.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit {

  form: FormGroup;
  config: IAppConfig;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private configService: AppConfigService,
    private snackbarServce: SnackbarService
  ) { }

  ngOnInit(): void {

    this.config = AppConfigService.settings;

    this.form = this.fb.group({
      ask_for_difficulty: this.fb.control(this.config.difficulty.ask_for_difficulty, {validators:[Validators.required]}),
      ask_for_instruments: this.fb.control(this.config.difficulty.ask_for_instruments, {validators:[Validators.required]}),
      ask_for_pieces: this.fb.control(this.config.difficulty.ask_for_pieces, {validators:[Validators.required]}),
      ask_for_available_solution: this.fb.control(this.config.difficulty.ask_for_available_solution, {validators:[Validators.required]}),
      ask_for_pieces_slider: this.fb.control(this.config.difficulty.ask_for_pieces_slider, {validators:[Validators.required]}),
      
      default_instruments: this.fb.control(this.config.difficulty.default_instruments, {validators:[Validators.required]}),
      default_pieces: this.fb.control(this.config.difficulty.default_pieces, {validators:[Validators.required]}),
      default_available_solution: this.fb.control(this.config.difficulty.default_available_solution, {validators:[Validators.required]}),
      default_pieces_slider: this.fb.control(this.config.difficulty.default_pieces_slider, {validators:[Validators.required]}),
    });
  }

  updateConfig(): void {
    Object.assign(this.config.difficulty, this.form.value);

    this.configService.save(this.config).subscribe((result) => {
      if (result) {
        this.snackbarServce.success(3, 'APP.UPDATE_SUCCESS');
      } else {
        this.snackbarServce.error(3, 'APP.UPDATE_ERROR');
      }
    });
  }

  remove(list: number[], option: number): void {
    const index = list.indexOf(option, 0);
    if (index > -1) {
      list.splice(index, 1);
    }
    if (this.form.get('default_instruments').value === option) {
      this.form.get('default_instruments').setValue(undefined);
    }
    if (this.form.get('default_pieces').value === option) {
      this.form.get('default_pieces').setValue(undefined);
    }
  }

  add(list: number[]): void {
    const dialogRef = this.dialog.open(NumberDialogComponent, 
      {
        disableClose: true,
        minWidth: '400px'
      });

    dialogRef.afterClosed().subscribe((result) => {
      if(result !== null) {
        list.push(result);
      }
    });
  }

}
