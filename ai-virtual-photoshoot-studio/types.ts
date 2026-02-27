/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type GarmentType = 'top' | 'bottom' | 'dress';

export interface PhotoshootImage {
  id: string;
  url: string;
  type: 'model' | 'garment';
  garmentType?: GarmentType;
}

export interface PhotoshootResult {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  prompt: string;
  timestamp: number;
}

export interface ApiError {
  message: string;
  details?: string;
}
