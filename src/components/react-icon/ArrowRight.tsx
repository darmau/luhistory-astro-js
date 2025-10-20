import * as React from "react";
import type { IconProps } from "@/types";

const ArrowRight = ({ width = 48, height = 48, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_147_656)">
      <path
        d="M7.5 24H40.5"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 10.5L40.5 24L27 37.5"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default ArrowRight;
