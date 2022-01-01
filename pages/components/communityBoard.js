import { useState } from 'react'

export const CommunityBoard = (props) => {
  const editing = props.data.editing
  const setEditing = props.data.setEditing
  const content = props.data.content
  const setContent = props.data.setContent

  const [newText, setNewText] = useState(props.data.content.text)

  function save() {
    setEditing(false)
    setContent({ text: newText, links: content.links })
  }

  function exit() {
    setEditing(false)
    setNewText(content.text)
  }

  return (
    <div className='bg-white w-full rounded-xl p-5'>
      <div className='flex justify-between'>
        <div></div>
        <div>
          {!editing && (
            <button className='text-gray-500 underline' onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
          {editing && (
            <>
              <button onClick={save} className='text-gray-500 mr-5'>
                ✅
              </button>
              <button onClick={exit} className='text-gray-500'>
                ❌
              </button>
            </>
          )}
        </div>
      </div>
      <input
        className='rounded font-bold bg-white p-5 focus:rounded focus:bg-gray-100 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        disabled={!editing}
        type='textarea'
        name='text'
        placeholder='Hey everyone...'
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
      ></input>
    </div>
  )
}
