export default function Row({ firstname, lastname, contact, location, work, role, refer, updated }) {
  return (
    <tr className="styled-rows">
      <td>{firstname} {lastname}</td>
      <td>{contact}</td>
      <td>{location}</td>
      <td>{work}</td>
      {/* <td className="flex flex-col">
        {projects.map((x, i) => (<a href={x}>
          {x.name}
        </a>))}
      </td> */}
      <td>{refer === "yes" ? '✅' : '❌'}</td>
      <td>{updated}</td>
    </tr>
  );
}
