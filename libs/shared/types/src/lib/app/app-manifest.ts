import { AppCategory } from './app-category';
import { AppStatus } from './app-status';

export interface AppManifest {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  path: string;
  category: AppCategory;
  status: AppStatus;
  tags: string[];
  accentColor: string; // Hex or CSS var for fun glowing borders/accents
}
