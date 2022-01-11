import { useState } from 'react'
export function Navbar(props) {
  const communities = props.communities
  const [active, setActive] = useState(communities[0])

  function onChange(e) {
    setActive(e.target.value)
    props.switchCommunity(e.target.value)
  }

  return (
    <ul className='flex border-b  bg-gray-100 rounded-t-lg'>
      {communities.map((community) => {
        const style = community === active ? 'bg-gray-200 text-blue-800 ' : 'text-gray-400 '
        return (
          <>
            <li className='mr-1'>
              <button
                onClick={onChange}
                value={community}
                className={style + 'rounded-t-lg inline-block py-2 px-4 hover:text-blue-800 font-semibold'}
              >
                {community}
              </button>
            </li>
          </>
        )
      })}
    </ul>
  )
}
