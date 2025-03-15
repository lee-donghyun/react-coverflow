import { EventHandler, MouseEvent, TouchEvent } from "react";

export const COVER_SIZE = 400;

export const Cover = ({
  src,
  onMouseDown,
  onMouseUp,
}: {
  src: string;
  onMouseDown: EventHandler<MouseEvent | TouchEvent>;
  onMouseUp: EventHandler<MouseEvent | TouchEvent>;
}) => (
  <button
    onMouseDown={onMouseDown}
    onTouchStart={onMouseDown}
    onMouseUp={onMouseUp}
    onTouchEnd={onMouseUp}
    tabIndex={-1}
    style={{
      padding: 0,
      margin: 0,
      background: "black",
      border: "none",

      userSelect: "none",

      width: COVER_SIZE,
      height: COVER_SIZE,
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: COVER_SIZE,
        left: 0,
        right: 0,
        height: COVER_SIZE,
        background: "black",

        userSelect: "none",
      }}
    ></div>
    <img
      style={{
        width: COVER_SIZE,
        height: COVER_SIZE,

        userSelect: "none",

        boxSizing: "border-box",

        pointerEvents: "none",
        WebkitBoxReflect:
          "below 0 linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4))",
      }}
      src={src}
    />
  </button>
);
