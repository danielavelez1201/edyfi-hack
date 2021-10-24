import Row from "./Row";

export default function SortableTable({ people }) {
  return (
    <div className='md:flex md:justify-center m-5 w-full relative z-40'>
      <div className='overflow-x-auto w-full '>
        <table id='table-element' className='styled-table table-fixed' style={{ minWidth: '100%' }}>
          <tr
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              textAlign: 'left'
            }}
          >
            <th>Name</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Work</th>
            <th>Role</th>
            <th>Referral?</th>
            <th>Projects</th>
            <th>Asks</th>
            <th>Updated</th>
          </tr>
          {people.length > 0 &&
            people.map((x, i) => (
              <Row
                key={i}
                firstname={x.firstName}
                lastname={x.lastName}
                phone={x.phone}
                email={x.email}
                location={x.location}
                work={x.work}
                refer={x.referral}
                projects={x.projects}
                role={x.role}
                asks={x.asks}
                updated={x.lastUpdated}
              />
            ))}
        </table>
      </div>
    </div>
  )
}
