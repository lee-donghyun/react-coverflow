import { Cover } from "./cover";

export const FlippedCover = ({
  meta,
  size,
}: {
  size: number;
  meta: Parameters<typeof Cover>[0]["meta"];
}) => (
  <div
    style={{
      width: size,
      height: size,
      padding: "2rem",
      backgroundColor: "#FFF",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h2
      style={{
        fontSize: "3rem",
        lineHeight: "0.8",
        letterSpacing: "-0.05em",
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
      }}
    >
      {meta.title}
    </h2>
    <ol
      style={{
        paddingLeft: "0",
        marginTop: "2rem",
        listStyleType: "none",
        overflowY: "scroll",
        flex: 1,
      }}
    >
      {meta.tracks.map(({ title }, index) => (
        <li
          key={index}
          style={{
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.03em",
            fontWeight: 600,
            color: "rgb(0 0 0 / 80%)",
            display: "flex",
            alignItems: "baseline",
            marginBottom: "0.125rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              display: "inline-block",
              width: "1.5rem",
            }}
          >
            {index + 1}.
          </span>
          <span style={{ flex: 1, fontSize: "1rem" }}>{title}</span>
        </li>
      ))}
    </ol>
  </div>
);
