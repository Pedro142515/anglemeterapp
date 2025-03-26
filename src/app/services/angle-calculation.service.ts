// Suggested code may be subject to a license. Learn more: ~LicenseLog:758037050.
import { Injectable } from '@angular/core';
import * as mathjs from 'mathjs';

export interface AngleCalculation {
  rawValue: number;
  normalizedAngle: number;
  quadrant: number;
  angleType: 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex';
  precision: number;
}

@Injectable({
  providedIn: 'root'
})
export class AngleCalculationService {
  constructor() {}

  /**
   * Normaliza el ángulo entre 0 y 360 grados
   * @param angle Ángulo de entrada
   * @returns Ángulo normalizado
   */
  normalizeAngle(angle: number): number {
    return mathjs.mod(angle, 360);
  }

  /**
   * Convierte ángulos entre diferentes unidades
   * @param angle Valor del ángulo
   * @param from Unidad de origen
   * @param to Unidad de destino
   * @returns Ángulo convertido
   */
  convertAngle(angle: number, from: 'degrees' | 'radians' | 'gradians', to: 'degrees' | 'radians' | 'gradians'): number {
    const conversions: Record<string, Record<string, (x: number) => number>> = {
      degrees: {
        radians: (x) => x * (Math.PI / 180),
        gradians: (x) => x * (10/9)
      },
      radians: {
        degrees: (x) => x * (180 / Math.PI),
        gradians: (x) => x * (200 / Math.PI)
      },
      gradians: {
        degrees: (x) => x * (9/10),
        radians: (x) => x * (Math.PI / 200)
      }
    };

    return conversions[from][to](angle);
  }

  /**
   * Clasifica el tipo de ángulo
   * @param angle Ángulo en grados
   * @returns Tipo de ángulo
   */
  classifyAngle(angle: number): 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex' {
    const normalizedAngle = this.normalizeAngle(angle);
    
    if (normalizedAngle === 0 || normalizedAngle === 360) return 'straight';
    if (normalizedAngle === 90) return 'right';
    if (normalizedAngle > 0 && normalizedAngle < 90) return 'acute';
    if (normalizedAngle > 90 && normalizedAngle < 180) return 'obtuse';
    if (normalizedAngle === 180) return 'straight';
    return 'reflex';
  }

  /**
   * Calcula detalles completos de un ángulo
   * @param rawValue Valor del ángulo sin procesar
   * @param precision Número de decimales
   * @returns Objeto con detalles del cálculo
   */
  calculateAngleDetails(rawValue: number, precision: number = 2): AngleCalculation {
    const normalizedAngle = this.normalizeAngle(rawValue);
    
    return {
      rawValue: rawValue,
      normalizedAngle: mathjs.round(normalizedAngle, precision),
      quadrant: Math.floor(normalizedAngle / 90) + 1,
      angleType: this.classifyAngle(normalizedAngle),
      precision: precision
    };
  }

  /**
   * Calcula el ángulo entre dos vectores
   * @param vector1 Primer vector
   * @param vector2 Segundo vector
   * @returns Ángulo entre vectores
   */
  calculateVectorAngle(vector1: [number, number], vector2: [number, number]): number {
    const dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
    const magnitudeVector1 = Math.sqrt(vector1[0] ** 2 + vector1[1] ** 2);
    const magnitudeVector2 = Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2);
    // Check if magnitudes are zero to avoid division by zero
    if (magnitudeVector1 === 0 || magnitudeVector2 === 0) {
      return 0;
    }
    const cosAngle = dotProduct / (magnitudeVector1 * magnitudeVector2);

    // Check if the value is within the valid range for acos (-1 to 1)
    const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));

    const angleInRadians = Math.acos(clampedCosAngle);
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    return mathjs.round(angleInDegrees, 2);
  }

  /**
   * Calcula la diferencia entre dos ángulos
   * @param angle1 Primer ángulo
   * @param angle2 Segundo ángulo
   * @returns Diferencia angular
   */
  calculateAngleDifference(angle1: number, angle2: number): number {
    return Math.abs(this.normalizeAngle(angle1 - angle2));
  }
}