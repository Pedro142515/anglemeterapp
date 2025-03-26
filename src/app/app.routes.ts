import { Routes } from '@angular/router';
import { AngleMeterComponent } from './pages/angle-meter/angle-meter.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AngleDisplayComponent } from './components/angle-display/angle-display.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'meter',
    pathMatch: 'full'
  },
  {
    path: 'meter',
    component: AngleMeterComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '**',
    redirectTo: 'meter'
  }
];