import { EventHandler, MouseEvent, TouchEvent } from "react";

export const Cover = ({
  size,
  meta,
  backgroundColor,
  onMouseDown,
  onMouseUp,
}: {
  meta: { src: string };
  size: string;
  backgroundColor: string;
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
      border: "none",

      userSelect: "none",

      width: size,
      height: size,
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: size,
        left: 0,
        right: 0,
        height: size,
        backgroundColor,

        userSelect: "none",
      }}
    ></div>
    <img
      style={{
        width: size,
        height: size,

        userSelect: "none",

        boxSizing: "border-box",

        pointerEvents: "none",
        WebkitBoxReflect:
          "below 0 linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4))",
      }}
      src={meta.src}
    />
  </button>
);
