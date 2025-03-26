
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AngleDisplayComponent } from '../../components/angle-display/angle-display.component';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
@Component({
  selector: 'app-angle-meter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    AngleDisplayComponent
  ],
  templateUrl: './angle-meter.component.html',
  styleUrl: './angle-meter.component.scss'
})
export class AngleMeterComponent implements OnInit, OnDestroy {
  currentAngle: number = 0;
  isTracking: boolean = false;
  orientationInterval: any;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.checkDeviceSupport();
  }

  async checkDeviceSupport(): Promise<void> {
    try {
      // Verificar si el plugin está disponible en la plataforma actual
      if (Capacitor.isPluginAvailable('Device')) {
        const deviceInfo = await Device.getInfo();
        const platform = deviceInfo.platform;

        if (platform === 'android' || platform === 'ios') {
          this.showNotification(`Dispositivo compatible: ${platform}`);
        } else {
          this.showNotification('Plataforma no compatible');
        }
      } else {
        this.showNotification('Plugin de dispositivo no disponible');
      }
    } catch (error) {
      this.showNotification('Error al verificar el dispositivo');
      console.error('Device support check error:', error);
    }
  }

  startMeasurement(): void {
    if (!this.isTracking) {
      this.isTracking = true;
      this.startOrientationTracking();
      this.showNotification('Medición de ángulo iniciada');
    }
  }

  stopMeasurement(): void {
    if (this.isTracking) {
      this.isTracking = false;
      this.stopOrientationTracking();
      this.showNotification('Medición de ángulo detenida');
    }
  }

  startOrientationTracking(): void {
    this.orientationInterval = setInterval(() => {
      // Simulated angle tracking (reemplazar con lógica real de sensores)
      this.currentAngle = Math.random() * 180;
    }, 500);
  }

  stopOrientationTracking(): void {
    if (this.orientationInterval) {
      clearInterval(this.orientationInterval);
    }
  }

  resetMeasurement(): void {
    this.currentAngle = 0;
    this.stopMeasurement();
    this.showNotification('Medición reiniciada');
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  ngOnDestroy(): void {
    this.stopOrientationTracking();
  }
}