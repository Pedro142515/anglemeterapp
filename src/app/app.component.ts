import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSnackBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [AndroidPermissions],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Angle Meter App';
  isDeviceCompatible: boolean = false;

  // Permissions object
  PERMISSIONS: { [key: string]: string } = {};

  // List of required permissions
  requiredPermissions: string[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private androidPermissions: AndroidPermissions
  ) {
    // Initialize permissions in the constructor
    this.PERMISSIONS = {
      INTERNET: this.androidPermissions.PERMISSION.INTERNET,
      BODY_SENSORS: this.androidPermissions.PERMISSION.BODY_SENSORS,
      FINE_LOCATION: this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      COARSE_LOCATION: this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
    };

    // Set required permissions using bracket notation
    this.requiredPermissions = [
      this.PERMISSIONS['INTERNET'],
      this.PERMISSIONS['BODY_SENSORS'],
      this.PERMISSIONS['FINE_LOCATION'],
      this.PERMISSIONS['COARSE_LOCATION']
    ];
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  async initializeApp(): Promise<void> {
    try {
      await this.checkPlatformCompatibility();
      if (this.isDeviceCompatible && Capacitor.getPlatform() === 'android') {
        await this.checkAndRequestAndroidPermissions();
      }
      this.setupAppListeners();
    } catch (error) {
      this.handleInitializationError(error);
    }
  }

  async checkPlatformCompatibility(): Promise<void> {
    const deviceInfo = await Device.getInfo();
    
    // Platform check
    if (deviceInfo.platform !== 'android') {
      this.showNotification('Solo compatible con Android');
      this.isDeviceCompatible = false;
      return;
    }
    
    // Android version check
    const androidVersion = parseFloat(deviceInfo.osVersion);
    if (androidVersion < 8.0) {
      this.showNotification('Se requiere Android 8.0 o superior');
      this.isDeviceCompatible = false;
      return;
    }
    
    this.isDeviceCompatible = true;
  }

  async checkAndRequestAndroidPermissions(): Promise<void> {
    try {
      for (const permission of this.requiredPermissions) {
        const checkResult = await this.androidPermissions.checkPermission(permission);
        
        if (!checkResult.hasPermission) {
          try {
            const requestResult = await this.androidPermissions.requestPermission(permission);
            
            if (!requestResult.hasPermission) {
              this.showNotification(`Permiso necesario: ${permission}`);
            }
          } catch (requestError) {
            console.error(`Error requesting permission ${permission}:`, requestError);
            this.showNotification(`No se pudo obtener el permiso: ${permission}`);
          }
        }
      }
    } catch (error) {
      console.error('Error en permisos:', error);
      this.showNotification('Error al verificar permisos');
    }
  }

  setupAppListeners(): void {
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive && Capacitor.getPlatform() === 'android') {
        await this.checkAndRequestAndroidPermissions();
      }
    });

    App.addListener('appUrlOpen', (data) => {
      console.log('App opened with URL:', data);
    });
  }

  private handleInitializationError(error: any): void {
    console.error('Initialization error:', error);
    this.showNotification('Error al iniciar la aplicación');
  }

  showNotification(message: string, duration: number = 2000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}