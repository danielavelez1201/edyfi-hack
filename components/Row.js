export default function Row({ name, contact, location, work, role, projects, refer, updated }) {
  return (
    <tr className="styled-rows">
      {console.log(name, contact)}
      <td>{name}</td>
      <td>{contact}</td>
      <td>{location}</td>
      <td>{work}</td>
      <td>{role}</td>
      <td className="flex flex-col">
        {projects.map((x, i) => (<a href={x}>
          {x.name}
        </a>))}
      </td>
      <td>{refer ? '✅' : '❌'}</td>
      <td>{updated}</td>
    </tr>
  );
}
