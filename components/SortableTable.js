import Row from "./Row";

export default function SortableTable({ people }) {
  return (
    <div className="md:flex md:justify-center m-5 overflow-x-auto relative z-40">
      <table
        id="table-element"
        className="w-full md:w-4/5 styled-table table-fixed"
      >
        <tr
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            textAlign: "left",
          }}
        >
          <th>Name</th>
          <th>Contact</th>
          <th>Location</th>
          <th>Work</th>
          <th>Role</th>
          <th>Projects</th>
          <th>Refer?</th>
          <th>Updated</th>
        </tr>
        {people.length > 0 && people.map((x, i) => (
          <Row
            key={i}
            name={x.name}
            contact={x.email === undefined ? x.phone : x.email}
            location={x.location}
            work={x.work}
            role={x.role}
            projects={x.projects}
            refer={x.refer}
            updated={x.updated}
          />
        ))}
      </table>
    </div>
  );
}
