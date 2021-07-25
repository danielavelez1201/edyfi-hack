export default function Row({ first, last, email, address, created, balance }) {
  return (
    <tr className="styled-rows">
      <td>{first}</td>
      <td>{last}</td>
      <td>{email}</td>
      <td>{address}</td>
      <td>{created}</td>
      <td>{balance}</td>
    </tr>
  );
}
