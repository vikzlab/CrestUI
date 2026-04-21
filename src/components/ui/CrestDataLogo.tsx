interface CrestDataLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export function CrestDataLogo({ size = 'md', variant = 'full' }: CrestDataLogoProps) {
  const scales = { sm: 0.65, md: 1, lg: 1.4 };
  const s = scales[size];

  if (variant === 'icon') {
    return (
      <svg
        width={Math.round(32 * s)}
        height={Math.round(32 * s)}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Crest Data"
      >
        <rect width="32" height="32" rx="8" fill="url(#crest-grad)" />
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="900"
          fontSize="14"
          fill="white"
          letterSpacing="-0.5"
        >
          CD
        </text>
        <defs>
          <linearGradient id="crest-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c3aed" />
            <stop offset="1" stopColor="#5b21b6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width={Math.round(130 * s)}
      height={Math.round(28 * s)}
      viewBox="0 0 130 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Crest Data"
    >
      {/* "crest" in white */}
      <text
        x="0"
        y="22"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="#f1f5f9"
        letterSpacing="-0.5"
      >
        crest
      </text>
      {/* "(data)" in violet */}
      <text
        x="62"
        y="22"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="#8b5cf6"
        letterSpacing="-0.5"
      >
        (data)
      </text>
    </svg>
  );
}
