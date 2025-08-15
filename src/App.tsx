import { useEffect, useState } from "react";
import { Coverflow } from "./coverflow";
import { covers } from "./data";
import * as styles from "./App.css";

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
        className={styles.container}
        style={{ backgroundColor: BACKGROUND_COLOR }}
      >
        <div className={styles.container_inner}>
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
      <div className={styles.display_positioner}>
        <div className={styles.display_inner}>
          selected = {selected}; index = {index}
        </div>
      </div>
      <div className={styles.credit}>
        credit:{" "}
        <a
          href="https://github.com/lee-donghyun/react-coverflow"
          target="_blank"
          rel="noreferrer"
          className={styles.credit_link}
        >
          github@lee-donghyun
        </a>
      </div>
    </>
  );
}

export default App;
