// components/IslaIllustration.tsx
'use client'

export function IslaIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair */}
      <path
        d="M100 40C70 40 50 60 50 90C50 70 60 50 80 45C85 43 90 42 95 42C90 35 95 25 105 25C115 25 120 35 115 42C120 42 125 43 130 45C150 50 160 70 160 90C160 60 140 40 110 40H100Z"
        fill="#D4A574"
      />
      {/* Face */}
      <ellipse cx="100" cy="110" rx="45" ry="50" fill="#FFD7BA" />
      {/* Eyes */}
      <circle cx="85" cy="105" r="8" fill="#87CEEB" />
      <circle cx="115" cy="105" r="8" fill="#87CEEB" />
      <circle cx="87" cy="103" r="3" fill="#000" />
      <circle cx="117" cy="103" r="3" fill="#000" />
      {/* Eyebrow scar */}
      <line x1="75" y1="92" x2="82" y2="90" stroke="#E6B399" strokeWidth="2" strokeLinecap="round" />
      {/* Freckles - triangle pattern on right cheek */}
      <circle cx="120" cy="115" r="1.5" fill="#D4A574" />
      <circle cx="125" cy="117" r="1.5" fill="#D4A574" />
      <circle cx="122" cy="120" r="1.5" fill="#D4A574" />
      {/* Nose */}
      <path d="M100 115 L100 125" stroke="#E6B399" strokeWidth="2" strokeLinecap="round" />
      {/* Mouth with gap */}
      <path
        d="M85 135 Q92 142 100 142 Q108 142 115 135"
        stroke="#D4756D"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tooth gap */}
      <line x1="100" y1="138" x2="100" y2="142" stroke="#FFD7BA" strokeWidth="1.5" />
      {/* Dimple on left cheek */}
      <circle cx="75" cy="125" r="3" fill="#FFB6A3" opacity="0.3" />
      {/* Body/shoulders */}
      <path
        d="M60 160 Q70 155 100 155 Q130 155 140 160 L150 200 Q125 195 100 195 Q75 195 50 200 L60 160Z"
        fill="#FF9FB0"
      />
    </svg>
  )
}
