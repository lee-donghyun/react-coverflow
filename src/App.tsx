import { Coverflow } from "./coverflow";

function App() {
  return (
    <div style={{ height: "100dvh", background: "black", overflow: "hidden" }}>
      <Coverflow
        size={window.innerWidth / 3.6}
        backgroundColor="black"
        covers={Array(100)
          .fill(0)
          .map((_, index) => ({ src: `${(index % 10) + 1}.jpg` }))}
      />
    </div>
  );
}

export default App;
