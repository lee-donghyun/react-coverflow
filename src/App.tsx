import { Coverflow } from "./coverflow";

function App() {
  return (
    <div style={{ height: "100vh", background: "black" }}>
      <Coverflow
        size={400}
        backgroundColor="black"
        covers={Array(100)
          .fill(0)
          .map((_, index) => ({ src: `${(index % 10) + 1}.jpg` }))}
      />
    </div>
  );
}

export default App;
