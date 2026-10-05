import { KmlDocument } from '../types/kml';
import { getPioIxDataset } from './pioIxData';

export interface SampleDataset {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  count: number;
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'pio-ix',
    name: 'Pio IX - PI (83964)',
    subtitle: 'Perímetro Municipal e 52 Localidades Fixas',
    location: 'Pio IX, Piauí',
    count: 53,
  },
];

export function getSampleDataset(_id?: string): KmlDocument {
  return getPioIxDataset();
}

export { getPioIxDataset };
