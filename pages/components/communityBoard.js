import { EmojiSadIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { classNames } from '../../components/shared/Utils'

const emojis = ['☕️', '📅', '🏡', '🎉', '📄', '🔗']

export const CommunityBoard = (props) => {
  const editing = props.data.editing
  const setEditing = props.data.setEditing
  const content = props.data.content
  const setContent = props.data.setContent

  const [newText, setNewText] = useState(content.text)
  const [newLinks, setNewLinks] = useState(content.links)

  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [newLinkURL, setNewLinkURL] = useState('')
  const [newLinkEmoji, setNewLinkEmoji] = useState('')

  function resetLinkInput() {
    setNewLinkTitle('')
    setNewLinkURL('')
    setNewLinkEmoji('')
  }

  function addNewLink() {
    if (newLinkURL === '') {
      return
    }
    setNewLinkTitle(newLinkTitle === '' ? newLinkURL : newLinkTitle)
    const newLinkObj = { title: newLinkTitle, URL: newLinkURL, emoji: newLinkEmoji, id: newLinks.length + 1 }
    setNewLinks([...newLinks, newLinkObj])
    resetLinkInput()
  }

  function deleteLink(link) {
    setNewLinks(
      newLinks.filter((existingLink) => {
        return existingLink.id !== link.id
      })
    )
  }

  function save() {
    setEditing(false)
    setContent({ text: newText, links: newLinks })
    resetLinkInput()
  }

  function exit() {
    setEditing(false)
    setNewText(content.text)
    setNewLinks(content.links)
    resetLinkInput()
  }

  return (
    <div className='bg-white w-full rounded-xl p-5'>
      <div className='flex justify-between'>
        {editing && (
          <div className='border-2 shadow-sm rounded-xl p-2 px-3 mb-3 flex'>
            <input
              onChange={(e) => setNewLinkTitle(e.target.value)}
              value={newLinkTitle}
              className='focus:outline-none overflow-ellipsis'
              type='textarea'
              placeholder='Link title'
            ></input>
            <input
              onChange={(e) => setNewLinkURL(e.target.value)}
              value={newLinkURL}
              className='ml-3 focus:outline-none text-gray-400 overflow-ellipsis'
              type='textarea'
              placeholder='Link URL'
            ></input>
            <div className='flex mx-5'>
              {emojis.map((emoji) => {
                return (
                  <button
                    onClick={() => setNewLinkEmoji(emoji)}
                    key={emoji}
                    className={classNames(
                      'px-1 border-2 border-gray-50 rounded-md hover:bg-gray-300',
                      emoji === newLinkEmoji ? 'bg-gray-300 border-gray-300' : ''
                    )}
                  >
                    {emoji}
                  </button>
                )
              })}
            </div>
            <div className='border-l-2 ml-3'>
              <button className='rounded-lg p-1 px-3 ml-3 hover:bg-gray-200' onClick={addNewLink}>
                ✚
              </button>
            </div>
          </div>
        )}
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
      <ul className='text-gray=700 p-5'>
        {newLinks.map((link) => {
          return (
            <li key={link.title} className='border-2 border-gray-100 rounded-xl p-2 mb-2 w-max flex items-center'>
              <div className='px-2'>{link.emoji}</div>
              <a className='px-2 border-l-2 hover:underline text-gray-500 font-bold' href={link.URL}>
                {link.title}
              </a>
              {editing && (
                <button className='rounded-lg p-1 hover:bg-gray-200' onClick={() => deleteLink(link)}>
                  ❌
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
