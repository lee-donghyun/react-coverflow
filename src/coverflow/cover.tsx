import { EventHandler, MouseEvent, TouchEvent, useState } from "react";
import * as styles from "./cover.css";

export const Cover = ({
  size,
  meta,
  backgroundColor,
  onMouseDown,
  onMouseUp,
}: {
  meta: { src: string; title: string; tracks: { title: string }[] };
  size: number;
  backgroundColor: string;
  onMouseDown: EventHandler<MouseEvent | TouchEvent>;
  onMouseUp: EventHandler<MouseEvent | TouchEvent>;
}) => {
  const [grabbing, setGrabbing] = useState(false);

  const handleMouseDown: EventHandler<MouseEvent | TouchEvent> = (e) => {
    setGrabbing(true);
    onMouseDown(e);
  };

  const handleMouseUp: EventHandler<MouseEvent | TouchEvent> = (e) => {
    setGrabbing(false);
    onMouseUp(e);
  };
  return (
    <div
      className={styles.cover_container}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className={styles.reflection}
        style={{
          backgroundColor,
          height: size,
        }}
      ></div>
      <button
        className={styles.cover_button}
        style={{ cursor: grabbing ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <img
          className={styles.cover_image}
          style={{
            width: size,
            height: size,
          }}
          src={meta.src}
        />
      </button>
    </div>
  );
};
