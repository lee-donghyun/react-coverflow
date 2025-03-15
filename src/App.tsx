import { useEffect, useState } from "react";
import { Coverflow } from "./coverflow";

const covers = Array(100)
  .fill(0)
  .map((_, index) => ({ src: `${(index % 10) + 1}.jpg` }));

const getSize = (width: number) => Math.max(width / 3.6, 200);

function App() {
  const [size, setSize] = useState(getSize(window.innerWidth));
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setSize(getSize(width));
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        height: "100dvh",
        background: "black",
        overflow: "hidden",

        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: 0,
          right: 0,
        }}
      >
        <Coverflow
          size={size}
          backgroundColor="black"
          covers={covers}
          key={size}
        />
      </div>
    </div>
  );
}

export default App;
