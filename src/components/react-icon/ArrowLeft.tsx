import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const ArrowLeft = ({ width = 48, height = 48, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_147_135)">
      <path
        d="M40.5 24H7.5"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 10.5L7.5 24L21 37.5"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default ArrowLeft;
