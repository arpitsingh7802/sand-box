import { AppManifest } from '@sand-box/types';

export const ALL_APPS: AppManifest[] = [
  {
    id: 'white-board-canvas',
    name: 'White Canvas',
    tagline: 'Infinite canvas playground',
    icon: '🎨',
    path: '/#/board',
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
