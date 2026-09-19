import { AppManifest } from '@sand-box/types';

export const ALL_APPS: AppManifest[] = [
  {
    id: 'pixel-forge',
    name: 'Pixel Forge',
    tagline: 'Real-time image manipulation & WebGL canvas playground',
    icon: '🎨',
    path: '/sand-box/pixel-forge/',
    category: 'tool',
    status: 'stable',
    tags: ['Canvas', 'Image', 'WebGL'],
    accentColor: '#38bdf8',
  },
  {
    id: 'data-vault',
    name: 'Data Vault',
    tagline: 'JSON formatter, JWT decoder & reactive state simulator',
    icon: '⚡',
    path: '/sand-box/data-vault/',
    category: 'utility',
    status: 'beta',
    tags: ['JSON', 'Crypto', 'Parsing'],
    accentColor: '#f59e0b',
  },
  {
    id: 'lab-bench',
    name: 'Lab Bench',
    tagline: 'Experimental Angular signal primitives & physics animations',
    icon: '🧪',
    path: '/sand-box/lab-bench/',
    category: 'playground',
    status: 'wip',
    tags: ['Signals', 'Animation', 'Physics'],
    accentColor: '#ec4899',
  },
];
