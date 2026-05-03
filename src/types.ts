/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CatStatus {
  STRAY = 'STRAY', // 流浪猫
  NEIGHBORHOOD = 'NEIGHBORHOOD', // 邻里散养
  SHOP = 'SHOP', // 店家猫
}

export interface CatLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface Cat {
  id: string;
  name: string;
  photoUrl: string;
  description: string;
  location: CatLocation;
  status: CatStatus;
  checkInDate: string;
  tags: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  language: string; // e.g., 'zh', 'en', 'ja'
  timestamp: string;
}
