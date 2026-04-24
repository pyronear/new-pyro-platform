import type { CSSProperties } from 'react';

interface PyronearForestWatchProps {
  className?: string;
  style?: CSSProperties;
}

export const PyronearForestWatch = ({
  className = '',
  style,
}: PyronearForestWatchProps) => {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <style>{`
        .pfw-hill-far { fill: #4a6b58; }
        .pfw-hill-mid { fill: #2d4638; }
        .pfw-hill-near { fill: #1a2b22; }
        .pfw-pine-trunk { fill: #1a1410; }
        .pfw-pine-far { fill: #3a5446; }
        .pfw-pine-mid { fill: #24382d; }
        .pfw-pine-near { fill: #14221c; }
        .pfw-logo-stroke {
          stroke: #f5b942;
          stroke-width: 7;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .pfw-logo-fill { fill: #ffffff; }
        .pfw-wordmark {
          fill: #f5b942;
          font-family: 'Arial Black', 'Helvetica', sans-serif;
          font-size: 52px;
          font-weight: 900;
          letter-spacing: 10px;
        }

        @keyframes pfw-scan-eye {
          0%   { transform: translateX(-5px); }
          20%  { transform: translateX(-5px); }
          35%  { transform: translateX(5px); }
          55%  { transform: translateX(5px); }
          70%  { transform: translateX(0); }
          85%  { transform: translateX(0); }
          100% { transform: translateX(-5px); }
        }
        @keyframes pfw-blink {
          0%, 44%, 50%, 92%, 96%, 100% { transform: scaleY(1); }
          46%, 48%, 93%, 95% { transform: scaleY(0.05); }
        }

        .pfw-pupil-scan {
          animation: pfw-scan-eye 7s ease-in-out infinite;
          transform-origin: 340px 278px;
        }
        .pfw-eye-lid {
          transform-origin: 340px 278px;
          animation: pfw-blink 6s ease-in-out infinite;
        }
      `}</style>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 680 500"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Pyronear logo watching a forest landscape"
      >
        <title>Pyronear watching the forest</title>

        {/* Far hill + trees */}
        <g>
          <path
            className="pfw-hill-far"
            d="M -20 270 Q 120 220 260 240 T 520 225 T 720 245 L 720 440 L -20 440 Z"
          />
          <g>
            <rect
              className="pfw-pine-trunk"
              x="77"
              y="240"
              width="3"
              height="14"
            />
            <polygon className="pfw-pine-far" points="78,218 70,244 86,244" />
            <polygon className="pfw-pine-far" points="78,228 72,250 84,250" />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="148"
              y="232"
              width="3"
              height="14"
            />
            <polygon
              className="pfw-pine-far"
              points="149,208 140,238 158,238"
            />
            <polygon
              className="pfw-pine-far"
              points="149,220 142,244 156,244"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="215"
              y="236"
              width="3"
              height="14"
            />
            <polygon
              className="pfw-pine-far"
              points="216,214 208,242 224,242"
            />
            <polygon
              className="pfw-pine-far"
              points="216,224 210,248 222,248"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="470"
              y="228"
              width="3"
              height="16"
            />
            <polygon
              className="pfw-pine-far"
              points="471,202 462,234 480,234"
            />
            <polygon
              className="pfw-pine-far"
              points="471,216 464,240 478,240"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="540"
              y="232"
              width="3"
              height="14"
            />
            <polygon
              className="pfw-pine-far"
              points="541,208 532,238 550,238"
            />
            <polygon
              className="pfw-pine-far"
              points="541,220 534,244 548,244"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="620"
              y="238"
              width="3"
              height="14"
            />
            <polygon
              className="pfw-pine-far"
              points="621,216 613,244 629,244"
            />
            <polygon
              className="pfw-pine-far"
              points="621,226 615,248 627,248"
            />
          </g>
        </g>

        {/* Mid hill + trees */}
        <g>
          <path
            className="pfw-hill-mid"
            d="M -40 320 Q 80 280 200 295 T 420 285 T 720 310 L 720 440 L -40 440 Z"
          />
          <g>
            <rect
              className="pfw-pine-trunk"
              x="40"
              y="298"
              width="4"
              height="20"
            />
            <polygon className="pfw-pine-mid" points="42,266 30,302 54,302" />
            <polygon className="pfw-pine-mid" points="42,282 32,310 52,310" />
            <polygon className="pfw-pine-mid" points="42,296 34,316 50,316" />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="105"
              y="292"
              width="4"
              height="20"
            />
            <polygon className="pfw-pine-mid" points="107,258 94,296 120,296" />
            <polygon className="pfw-pine-mid" points="107,276 96,306 118,306" />
            <polygon className="pfw-pine-mid" points="107,292 98,312 116,312" />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="175"
              y="296"
              width="4"
              height="20"
            />
            <polygon
              className="pfw-pine-mid"
              points="177,262 165,300 189,300"
            />
            <polygon
              className="pfw-pine-mid"
              points="177,280 167,308 187,308"
            />
            <polygon
              className="pfw-pine-mid"
              points="177,294 169,314 185,314"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="495"
              y="300"
              width="4"
              height="20"
            />
            <polygon
              className="pfw-pine-mid"
              points="497,266 485,304 509,304"
            />
            <polygon
              className="pfw-pine-mid"
              points="497,284 487,312 507,312"
            />
            <polygon
              className="pfw-pine-mid"
              points="497,298 489,318 505,318"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="570"
              y="304"
              width="4"
              height="20"
            />
            <polygon
              className="pfw-pine-mid"
              points="572,270 560,308 584,308"
            />
            <polygon
              className="pfw-pine-mid"
              points="572,288 562,316 582,316"
            />
            <polygon
              className="pfw-pine-mid"
              points="572,302 564,322 580,322"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="640"
              y="302"
              width="4"
              height="20"
            />
            <polygon
              className="pfw-pine-mid"
              points="642,268 630,306 654,306"
            />
            <polygon
              className="pfw-pine-mid"
              points="642,286 632,314 652,314"
            />
            <polygon
              className="pfw-pine-mid"
              points="642,300 634,320 650,320"
            />
          </g>
        </g>

        {/* Near hill + trees */}
        <g>
          <path
            className="pfw-hill-near"
            d="M -60 385 Q 80 345 200 360 T 420 350 T 620 365 T 740 380 L 740 440 L -60 440 Z"
          />
          <g>
            <rect
              className="pfw-pine-trunk"
              x="20"
              y="345"
              width="5"
              height="28"
            />
            <polygon className="pfw-pine-near" points="22,301 5,351 39,351" />
            <polygon className="pfw-pine-near" points="22,325 7,361 37,361" />
            <polygon className="pfw-pine-near" points="22,343 9,369 35,369" />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="80"
              y="350"
              width="5"
              height="28"
            />
            <polygon className="pfw-pine-near" points="82,306 65,356 99,356" />
            <polygon className="pfw-pine-near" points="82,330 67,366 97,366" />
            <polygon className="pfw-pine-near" points="82,348 69,374 95,374" />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="145"
              y="346"
              width="5"
              height="28"
            />
            <polygon
              className="pfw-pine-near"
              points="147,302 130,352 164,352"
            />
            <polygon
              className="pfw-pine-near"
              points="147,326 132,362 162,362"
            />
            <polygon
              className="pfw-pine-near"
              points="147,344 134,370 160,370"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="555"
              y="352"
              width="5"
              height="28"
            />
            <polygon
              className="pfw-pine-near"
              points="557,308 540,358 574,358"
            />
            <polygon
              className="pfw-pine-near"
              points="557,332 542,368 572,368"
            />
            <polygon
              className="pfw-pine-near"
              points="557,350 544,376 570,376"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="615"
              y="348"
              width="5"
              height="28"
            />
            <polygon
              className="pfw-pine-near"
              points="617,304 600,354 634,354"
            />
            <polygon
              className="pfw-pine-near"
              points="617,328 602,364 632,364"
            />
            <polygon
              className="pfw-pine-near"
              points="617,346 604,372 630,372"
            />
          </g>
          <g>
            <rect
              className="pfw-pine-trunk"
              x="665"
              y="354"
              width="5"
              height="28"
            />
            <polygon
              className="pfw-pine-near"
              points="667,310 650,360 684,360"
            />
            <polygon
              className="pfw-pine-near"
              points="667,334 652,370 682,370"
            />
            <polygon
              className="pfw-pine-near"
              points="667,352 654,378 680,378"
            />
          </g>
        </g>

        {/* White band under the scene for the wordmark */}
        <rect x="0" y="440" width="680" height="60" fill="#ffffff" />

        {/* Pyronear logo */}
        <g transform="translate(340 210) scale(1.15) translate(-340 -210)">
          <path
            className="pfw-logo-fill"
            d="M 340 105 C 330 135, 318 160, 305 180 C 298 170, 292 160, 285 152 C 268 176, 258 205, 258 235 C 258 280, 290 315, 340 315 C 390 315, 422 280, 422 240 C 422 205, 405 168, 388 140 C 378 155, 368 165, 358 170 C 355 145, 350 125, 340 105 Z"
          />
          <path
            className="pfw-logo-stroke"
            d="M 340 105 C 330 135, 318 160, 305 180 C 298 170, 292 160, 285 152 C 268 176, 258 205, 258 235 C 258 280, 290 315, 340 315 C 390 315, 422 280, 422 240 C 422 205, 405 168, 388 140 C 378 155, 368 165, 358 170 C 355 145, 350 125, 340 105 Z"
          />

          <g className="pfw-eye-lid">
            <path
              className="pfw-logo-stroke"
              style={{ fill: '#ffffff' }}
              d="M 280 278 Q 340 238 400 278 Q 340 312 280 278 Z"
            />
            <g className="pfw-pupil-scan">
              <circle
                cx="340"
                cy="278"
                r="13"
                fill="#f5b942"
                stroke="#f5b942"
                strokeWidth="5"
              />
            </g>
          </g>
        </g>

        {/* Wordmark */}
        <text x="340" y="485" textAnchor="middle" className="pfw-wordmark">
          PYRONEAR
        </text>
      </svg>
    </div>
  );
};
