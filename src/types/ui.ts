/**
 * UI component type definitions
 * Common types for UI elements like icons, images, and cursors
 */

import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

export type ImageSize = {
  width: number;
  height: number;
};

export type CursorPosition = {
  x: number;
  y: number;
};
