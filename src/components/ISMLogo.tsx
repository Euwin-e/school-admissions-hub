export const ISMLogo = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background */}
    <rect width="100" height="100" fill="#3d2817" rx="4" />
    
    {/* Border */}
    <rect
      x="8"
      y="8"
      width="84"
      height="84"
      fill="none"
      stroke="#e67e22"
      strokeWidth="2"
      rx="2"
    />
    
    {/* Building/Grid representation */}
    <g stroke="#e67e22" strokeWidth="2" fill="none">
      {/* Top row - 5 windows */}
      <rect x="16" y="18" width="12" height="12" />
      <rect x="32" y="18" width="12" height="12" />
      <rect x="48" y="18" width="12" height="12" />
      <rect x="64" y="18" width="12" height="12" />
      
      {/* Second row - 5 windows */}
      <rect x="16" y="36" width="12" height="12" />
      <rect x="32" y="36" width="12" height="12" />
      <rect x="48" y="36" width="12" height="12" />
      <rect x="64" y="36" width="12" height="12" />
      
      {/* Third row - 5 windows */}
      <rect x="16" y="54" width="12" height="12" />
      <rect x="32" y="54" width="12" height="12" />
      <rect x="48" y="54" width="12" height="12" />
      <rect x="64" y="54" width="12" height="12" />
    </g>
    
    {/* ISM text */}
    <text
      x="50"
      y="82"
      fontSize="10"
      fontWeight="bold"
      fill="#e67e22"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
    >
      ISM
    </text>
  </svg>
);
