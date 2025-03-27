
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
  private orientationHandler: (event: DeviceOrientationEvent) => void;

  constructor(private snackBar: MatSnackBar) {
    this.orientationHandler = this.handleOrientation.bind(this);
  }

  ngOnInit(): void {
    this.checkDeviceSupport();
  }

  async checkDeviceSupport(): Promise<void> {
    try {
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
      // Check if requestPermission method exists on window object
      const deviceOrientation = window as any;
      
      if (deviceOrientation.DeviceOrientationEvent && 
          typeof deviceOrientation.DeviceOrientationEvent.requestPermission === 'function') {
        deviceOrientation.DeviceOrientationEvent.requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              this.startOrientationTracking();
            } else {
              this.showNotification('Permiso de orientación denegado');
            }
          })
          .catch(console.error);
      } else {
        // For browsers without explicit permission method
        this.startOrientationTracking();
      }
    }
  }

  startOrientationTracking(): void {
    this.isTracking = true;
    window.addEventListener('deviceorientation', this.orientationHandler);
    this.showNotification('Medición de ángulo iniciada');
  }

  handleOrientation(event: DeviceOrientationEvent): void {
    // Use beta for vertical tilt (pitch)
    // Beta ranges from -180 to 180 degrees
    // Normalize to 0-360 range and handle negative values
    let angle = event.beta || 0;
    
    // Normalize angle to ensure it's always between 0 and 360
    angle = angle >= 0 ? angle : 360 + angle;
    
    this.currentAngle = angle;
  }

  stopMeasurement(): void {
    if (this.isTracking) {
      this.stopOrientationTracking();
      this.showNotification('Medición de ángulo detenida');
    }
  }

  stopOrientationTracking(): void {
    this.isTracking = false;
    window.removeEventListener('deviceorientation', this.orientationHandler);
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