interface AdPlacementProps {
  slot: "header" | "sidebar" | "footer" | "in-content";
  className?: string;
}

export function AdPlacement({ slot, className = "" }: AdPlacementProps) {
  const adSenseEnabled = import.meta.env.VITE_ADSENSE_ENABLED === "true";
  const adSenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  
  if (!adSenseEnabled || !adSenseClientId) {
    return null;
  }

  const getSlotDimensions = () => {
    switch (slot) {
      case "header":
        return { width: 728, height: 90 };
      case "sidebar":
        return { width: 300, height: 250 };
      case "footer":
        return { width: 728, height: 90 };
      case "in-content":
        return { width: 336, height: 280 };
      default:
        return { width: 300, height: 250 };
    }
  };

  const { width, height } = getSlotDimensions();

  return (
    <div 
      className={`ad-placement ad-${slot} ${className}`}
      data-testid={`ad-placement-${slot}`}
      style={{ 
        minWidth: width, 
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: `${width}px`, height: `${height}px` }}
        data-ad-client={adSenseClientId}
        data-ad-slot={import.meta.env[`VITE_ADSENSE_SLOT_${slot.toUpperCase().replace("-", "_")}`] || ""}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSenseScript() {
  const adSenseEnabled = import.meta.env.VITE_ADSENSE_ENABLED === "true";
  const adSenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  
  if (!adSenseEnabled || !adSenseClientId) {
    return null;
  }

  return (
    <script 
      async 
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
      crossOrigin="anonymous"
    />
  );
}
