import { ToolGroupId } from './tool-group-id.ts';
import { ToolType } from './tool-type';

export interface ToolGroup {
  id: ToolGroupId;
  tools: readonly ToolDefinition[];
}

export interface ToolDefinition {
  id: ToolType;
  label: string;
  icon: string;
}
