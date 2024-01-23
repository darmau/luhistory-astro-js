import * as React from "react";

const ArrowLeft = ({ width = '48', height = '48' }) => (
    <svg xmlns = "http://www.w3.org/2000/svg" width = {width} height = {height} viewBox = "0 0 48 48" fill = "none">
      <g clip-path = "url(#clip0_147_135)">
        <path
            d = "M40.5 24H7.5" stroke = "#171717" stroke-width = "2" stroke-linecap = "round" stroke-linejoin = "round"
        />
        <path
            d = "M21 10.5L7.5 24L21 37.5" stroke = "#171717" stroke-width = "2" stroke-linecap = "round"
            stroke-linejoin = "round"
        />
      </g>
    </svg>
);

export default ArrowLeft;
