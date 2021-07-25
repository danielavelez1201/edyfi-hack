export default function Row({ name, location, status }) {
  return (
    <tr className="styled-rows">
      <td>{name}</td>
      <td>{location}</td>
      <td>{status}</td>
    </tr>
  );
}
