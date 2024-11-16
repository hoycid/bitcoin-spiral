import React, { useEffect } from "react";

const CoinGeckoWidget = () => {
  useEffect(() => {
    // Dynamically load the CoinGecko widget script
    const script = document.createElement("script");
    script.src =
      "https://widgets.coingecko.com/gecko-coin-price-static-headline-widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* CoinGecko Widget DOM element */}
      <gecko-coin-price-static-headline-widget
        locale="en"
        dark-mode="true"
        transparent-background="true"
        coin-ids="bitcoin"
        initial-currency="usd"
      ></gecko-coin-price-static-headline-widget>
    </div>
  );
};

export default CoinGeckoWidget;
