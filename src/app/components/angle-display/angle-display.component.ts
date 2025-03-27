import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class AngleDisplayComponent implements OnInit, OnChanges {
  @Input() angle: number = 0;
  @Input() unit: 'degrees' | 'radians' = 'degrees';

  displayAngle: number = 0;
  angleCategory: string = '';
  angleProgress: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.calculateAngleDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This method will be called whenever the input angle changes
    if (changes['angle']) {
      this.calculateAngleDetails();
    }
  }

  calculateAngleDetails(): void {
    // Convert angle to degrees if in radians
    this.displayAngle =
      this.unit === 'radians'
        ? Number(mathjs.format(mathjs.multiply(this.angle, 180 / Math.PI), { precision: 2 }))
        : Number(mathjs.format(this.angle, { precision: 2 }));

    // Categorize the angle
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