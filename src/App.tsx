import { Coverflow } from "./coverflow";

function App() {
  return (
    <div style={{ height: "100vh", background: "black" }}>
      <Coverflow
        covers={Array(100)
          .fill(0)
          .map((_, index) => ({ src: `${(index % 10) + 1}.jpg` }))}
        size={`400px`}
      />
    </div>
  );
}

export default App;
