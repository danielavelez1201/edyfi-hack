export default function Row({
  firstname,
  lastname,
  email,
  phone,
  location,
  work,
  refer,
  projects,
  role,
  asks,
  updated
}) {
  return (
    <tr className='styled-rows'>
      <td>
        {firstname} {lastname}
      </td>
      <td>
        {email}, {phone}
      </td>
      <td>{location}</td>
      <td>{work}</td>
      <td>{refer ? '✅' : '❌'}</td>
      <td className='flex flex-col'>
        {projects.map((x, i) => (
          <a key={i} href={x}>
            {x}
          </a>
        ))}
      </td>
      <td>{role}</td>
      <td>{asks}</td>
      <td>{updated}</td>
    </tr>
  )
}
