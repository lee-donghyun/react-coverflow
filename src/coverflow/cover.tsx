import { EventHandler, MouseEvent, TouchEvent } from "react";

export const Cover = ({
  size,
  meta,
  backgroundColor,
  onMouseDown,
  onMouseUp,
}: {
  meta: { src: string };
  size: number;
  backgroundColor: string;
  onMouseDown: EventHandler<MouseEvent | TouchEvent>;
  onMouseUp: EventHandler<MouseEvent | TouchEvent>;
}) => (
  <div
    style={{
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
    <button
      style={{ all: "unset", cursor: "pointer" }}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp}
    >
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
  </div>
);
