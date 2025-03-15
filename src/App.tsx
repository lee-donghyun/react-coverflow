import { useEffect, useState } from "react";
import { Coverflow } from "./coverflow";

const covers = Array(100)
  .fill(0)
  .map((_, index) => ({ src: `${(index % 10) + 1}.jpg` }));

const getSize = (width: number) => Math.max(width / 3.6, 200);

const BACKGROUND_COLOR = "rgb(0, 0, 0)";

function App() {
  const [size, setSize] = useState(getSize(window.innerWidth));

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setSize(getSize(width));
      setIndex(0);
      setSelected(0);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        style={{
          height: "100dvh",
          backgroundColor: BACKGROUND_COLOR,
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
            backgroundColor={BACKGROUND_COLOR}
            covers={covers}
            key={size}
            onSelected={setSelected}
            onChange={setIndex}
          />
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 10,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            padding: "1rem",
            color: "white",
            background: "rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            borderRadius: "1rem",
            backdropFilter: "blur(1rem)",
            fontFamily: "monospace",
          }}
        >
          selected = {selected}; index = {index}
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          padding: "1rem",
          color: "white",
          background: "rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          borderRadius: "1rem",
          backdropFilter: "blur(1rem)",
          fontFamily: "monospace",
        }}
      >
        credit:{" "}
        <a
          href="https://github.com/lee-donghyun/react-coverflow"
          target="_blank"
          rel="noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          github@lee-donghyun
        </a>
      </div>
    </>
  );
}

export default App;
