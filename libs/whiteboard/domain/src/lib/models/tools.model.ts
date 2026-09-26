export type ToolType = 'select' | 'pan' | 'rectangle' | 'pen' | 'circle';

export interface Tool {
  id: ToolType;
  label: string;
  icon: string;
}
