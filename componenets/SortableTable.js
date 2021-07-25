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
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Created</th>
          <th>Balance</th>
        </tr>
        {people.map((x, i) => (
          <Row
            key={Math.random()}
            first={x.first}
            last={x.last}
            email={x.email}
            location={x.address}
            lastUpdated={x.created}
            referral={x.balance}
          />
        ))}
      </table>
    </div>
  );
}
