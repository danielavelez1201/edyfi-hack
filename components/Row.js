import axios from 'axios'

export default function Row({ firstname, lastname, email, contact, location, work, role, refer, updated, rest }) {
  const createUpdateRequest = () => {
    axios.post('/api/createUpdateRequest', { email })
  }

  console.log({ rest })

  return (
    <tr className='styled-rows'>
      <td>
        {firstname} {lastname}
      </td>
      <td>{contact}</td>
      <td>{location}</td>
      <td>{work}</td>
      {/* <td className="flex flex-col">
        {projects.map((x, i) => (<a href={x}>
          {x.name}
        </a>))}
      </td> */}
      <td>{refer === 'yes' ? '✅' : '❌'}</td>
      <td>-</td>
      <td>
        <button onClick={createUpdateRequest}>edit</button>
      </td>
    </tr>
  )
}
