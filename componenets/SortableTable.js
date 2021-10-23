import Row from "./row";

export default function SortableTable({ people }) {
  return (
    <div className="md:flex md:justify-center m-5 overflow-x-auto relative z-40">
      <table
        id="table-element"
        className="w-full styled-table border-collapse table-auto "
      >
        <tr
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            textAlign: "left",
          }}
        >
          <th>Name</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
        {people.length > 0 && people.map((x, i) => (
          <Row
            key={Math.random()}
            location={x.location}
            name={x.name}
            status={x.status}
          />
        ))}
      </table>
    </div>
  );
}
