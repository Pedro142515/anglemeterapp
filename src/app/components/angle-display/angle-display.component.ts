import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import * as mathjs from 'mathjs';

@Component({
  selector: 'app-angle-display',
  standalone: true,
  imports: [MatCardModule, MatProgressBarModule, CommonModule],
  templateUrl: './angle-display.component.html',
  styleUrl: './angle-display.component.scss'
})
export class AngleDisplayComponent implements OnInit {
  @Input() angle: number = 0;
  @Input() unit: 'degrees' | 'radians' = 'degrees';

  displayAngle: number = 0;
  angleCategory: string = '';
  angleProgress: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.calculateAngleDetails();
  }

  calculateAngleDetails(): void {
    this.displayAngle =
      this.unit === 'radians'
        ? Number(mathjs.format(mathjs.multiply(this.angle, 180 / Math.PI), { precision: 2 }))
        : Number(mathjs.format(this.angle, { precision: 2 }));


    // Categorizar el ángulo
    if (this.displayAngle >= 0 && this.displayAngle < 90) {
      this.angleCategory = 'Agudo';
      this.angleProgress = this.displayAngle;
    } else if (this.displayAngle === 90) {
      this.angleCategory = 'Recto';
      this.angleProgress = 100;
    } else if (this.displayAngle > 90 && this.displayAngle < 180) {
      this.angleCategory = 'Obtuso';
      this.angleProgress = this.displayAngle;
    } else if (this.displayAngle === 180) {
      this.angleCategory = 'Llano';
      this.angleProgress = 100;
    } else {
      this.angleCategory = 'Ángulo especial';
      this.angleProgress = 0;
    }
  }
}