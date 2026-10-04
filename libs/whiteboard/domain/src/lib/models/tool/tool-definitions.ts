import { ToolGroup } from './tool-group.model';

export const TOOL_GROUPS: readonly ToolGroup[] = [
  {
    id: 'navigation',
    tools: [
      { id: 'select', label: 'Select', icon: '👆' },
      { id: 'pan', label: 'Hand', icon: '✋' },
    ],
  },
  {
    id: 'drawing',
    tools: [
      { id: 'rectangle', label: 'Rectangle', icon: '⬜' },
      { id: 'pen', label: 'Pen', icon: '✏️' },
      { id: 'circle', label: 'Circle', icon: 'O' },
    ],
  },
];
