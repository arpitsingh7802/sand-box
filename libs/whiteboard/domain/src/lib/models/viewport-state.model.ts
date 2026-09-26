export interface ViewportState {
  /** Offset X in screen coordinates */
  panX: number;
  /** Offset Y in screen coordinates */
  panY: number;
  /** Scale factor (1.0 = 100%) */
  zoom: number;
}

export interface ZoomLimits {
  minZoom: number;
  maxZoom: number;
}

export const DEFAULT_ZOOM_LIMITS: ZoomLimits = {
  minZoom: 0.1,
  maxZoom: 5.0,
};
