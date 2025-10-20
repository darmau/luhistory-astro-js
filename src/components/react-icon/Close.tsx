import * as React from "react";
import type { IconProps } from "@/types";

const Close = ({ width = 48, height = 48, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <g opacity="0.5" clipPath="url(#clip0_1_3)">
      <circle cx="24" cy="24" r="24" fill="#F5F5F5" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.9571 19.7071C30.3476 19.3166 30.3476 18.6834 29.9571 18.2929C29.5666 17.9024 28.9334 17.9024 28.5429 18.2929L23.625 23.2108L18.7071 18.2929C18.3166 17.9024 17.6834 17.9024 17.2929 18.2929C16.9024 18.6834 16.9024 19.3166 17.2929 19.7071L22.2108 24.625L17.2929 29.5429C16.9024 29.9334 16.9024 30.5666 17.2929 30.9571C17.6834 31.3476 18.3166 31.3476 18.7071 30.9571L23.625 26.0392L28.5429 30.9571C28.9334 31.3476 29.5666 31.3476 29.9571 30.9571C30.3476 30.5666 30.3476 29.9334 29.9571 29.5429L25.0392 24.625L29.9571 19.7071Z"
        fill="#171717"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_3">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Close;
