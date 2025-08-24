import React, { useEffect } from "react";

const ClickSpark = ({
  children,
  sparkColor = "#fff",
  sparkLength = 20,      // how long each line is
  sparkThickness = 2,    // how thin each line is
  sparkRadius = 30,      // how far it travels
  sparkCount = 8,
  duration = 400,
}) => {
  useEffect(() => {
    const createSpark = (x, y) => {
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount;
        const dx = Math.cos(angle) * sparkRadius;
        const dy = Math.sin(angle) * sparkRadius;

        const spark = document.createElement("div");
        spark.style.position = "absolute";
        spark.style.width = `${sparkLength}px`;
        spark.style.height = `${sparkThickness}px`;
        spark.style.backgroundColor = sparkColor;
        spark.style.pointerEvents = "none";
        spark.style.zIndex = "9999";
        spark.style.top = `${y}px`;
        spark.style.left = `${x}px`;
        spark.style.transformOrigin = "left center";
        spark.style.transform = `rotate(${angle}rad)`;

        spark.animate(
          [
            { transform: `rotate(${angle}rad) scaleX(0)`, opacity: 1 },
            { transform: `rotate(${angle}rad) scaleX(1) translateX(${sparkRadius}px)`, opacity: 0 },
          ],
          {
            duration,
            easing: "ease-out",
          }
        );

        document.body.appendChild(spark);
        setTimeout(() => document.body.removeChild(spark), duration);
      }
    };

    const handleClick = (e) => {
      createSpark(e.clientX, e.clientY);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [sparkColor, sparkLength, sparkThickness, sparkRadius, sparkCount, duration]);

  return <>{children}</>;
};

export default ClickSpark;
