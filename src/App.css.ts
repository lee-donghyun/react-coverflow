import { style } from "@vanilla-extract/css";

export const container = style({
  height: "100dvh",
  overflow: "hidden",
  position: "relative",
});

export const container_inner = style({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  left: 0,
  right: 0,
});

export const display_positioner = style({
  position: "fixed",
  bottom: 10,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  padding: "1rem",
});

export const display_inner = style({
  padding: "1rem",
  color: "white",
  background: "rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  borderRadius: "1rem",
  backdropFilter: "blur(1rem)",
  fontFamily: "monospace",
});

export const credit = style({
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
});

export const credit_link = style({
  color: "white",
  textDecoration: "underline",
});
