import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  angleUnits: string[] = ['Grados', 'Radianes'];
  precisionOptions: number[] = [1, 2, 3, 4];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.settingsForm = this.formBuilder.group({
      angleUnit: ['Grados', Validators.required],
      precision: [2, [Validators.required, Validators.min(1), Validators.max(4)]],
      calibrationOffset: [0, [Validators.required, Validators.min(-10), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.loadSavedSettings();
  }

  async loadSavedSettings(): Promise<void> {
    try {
      const { value: angleUnit } = await Preferences.get({ key: 'angleUnit' });
      const { value: precision } = await Preferences.get({ key: 'precision' });
      const { value: calibrationOffset } = await Preferences.get({ key: 'calibrationOffset' });

      if (angleUnit) this.settingsForm.get('angleUnit')?.setValue(angleUnit);
      if (precision) this.settingsForm.get('precision')?.setValue(Number(precision));
      if (calibrationOffset) this.settingsForm.get('calibrationOffset')?.setValue(Number(calibrationOffset));
    } catch (error) {
      this.showNotification('Error al cargar configuraciones guardadas');
    }
  }

  async saveSettings(): Promise<void> {
    if (this.settingsForm.valid) {
      try {
        const formValues = this.settingsForm.value;

        await Preferences.set({
          key: 'angleUnit',
          value: formValues.angleUnit
        });

        await Preferences.set({
          key: 'precision',
          value: formValues.precision.toString()
        });

        await Preferences.set({
          key: 'calibrationOffset',
          value: formValues.calibrationOffset.toString()
        });

        this.showNotification('Configuraciones guardadas correctamente');
      } catch (error) {
        this.showNotification('Error al guardar configuraciones');
      }
    } else {
      this.showNotification('Por favor, complete todos los campos correctamente');
    }
  }

  resetToDefaults(): void {
    this.settingsForm.reset({
      angleUnit: 'Grados',
      precision: 2,
      calibrationOffset: 0
    });
    this.saveSettings();
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}