// libs/types/src/lib/app-manifest.ts
export type AppCategory = 'utility' | 'playground' | 'tool' | 'experimental';
export type AppStatus = 'stable' | 'beta' | 'wip';

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
