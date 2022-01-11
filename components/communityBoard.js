import { useEffect, useState } from 'react'
import { classNames } from './shared/Utils'
import axios from 'axios'
import { format } from 'date-fns'

export const CommunityBoard = (props) => {
  const editing = props.data.editing
  const setEditing = props.data.setEditing
  const content = props.data.content
  const setContent = props.data.setContent
  const communityId = props.data.communityId

  const [newText, setNewText] = useState(content.text)
  const [newLinks, setNewLinks] = useState(content.links)
  const [newEvents, setNewEvents] = useState(content.events)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCommunityBoard() {
      await axios
        .post('/api/getCommunityBoard', {
          headers: { communityId: communityId }
        })
        .then((res) => {
          console.log(res.data)
          if (res.data.communityBoard) {
            setContent(res.data.communityBoard)
            setNewText(res.data.communityBoard.text)
            setNewLinks(res.data.communityBoard.links)
            setNewEvents(res.data.communityBoard.events)
            setLoading(false)
          }
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
        })
    }
    getCommunityBoard()
  }, [communityId, loading, setContent])

  // LINKS -------------------------------
  const linkEmojis = ['☕️', '📅', '🏡', '🎉', '📄', '🔗']
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

  // EVENTS -------------------------------
  const eventEmojis = ['☕️', '🛠', '📅', '🏡', '✨', '🎉']

  function googleCalLink(event) {
    const baseURL = 'https://calendar.google.com/calendar/r/eventedit?'
    const params = { text: event.title, details: event.description, location: event.location, dates: event.date }
    const encodedParams = new URLSearchParams(params)
    return `${baseURL}${encodedParams}`
  }

  function emptyEvent(id) {
    return { title: '', link: '', date: '', location: '', description: '', emoji: '', id: id }
  }
  const [newEventInfo, setNewEventInfo] = useState(emptyEvent(newEvents.length + 1))

  function deleteEvent(event) {
    setNewEvents(
      newEvents.filter((existingEvent) => {
        return existingEvent.id !== event.id
      })
    )
  }

  function addNewEvent() {
    if (newEventInfo.title === '' && newEventInfo.link === '') {
      return
    }
    setNewEvents([...newEvents, newEventInfo])
    setNewEventInfo(emptyEvent(newEvents.length + 1))
  }

  function formatDate(date) {
    console.log(date)
    // const dateObj = new Date(Date.parse(date))
    //return dateObj.getDay() + ', ' + dateObj.getMonth() + ' ' + dateObj.getDay()
    return format(new Date(date), 'EEEE, MMMM d yyyy')
  }

  // GENERAL FUNCTIONS -------------------------------
  async function save() {
    setEditing(false)
    setContent({ text: newText, links: newLinks, events: newEvents })
    resetLinkInput()
    setNewEventInfo(emptyEvent(newEvents.length + 1))

    console.log({ content })

    await axios
      .post('/api/saveCommunityBoard', {
        board: { text: newText, links: newLinks, events: newEvents },
        communityId: communityId
      })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log('error')
      })
  }

  function exit() {
    setEditing(false)
    setNewText(content.text)
    setNewLinks(content.links)
    resetLinkInput()
    setNewEvents(content.events)
    setNewEventInfo(emptyEvent(content.events.length + 1))
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
              placeholder='Link text'
            ></input>
            <input
              onChange={(e) => setNewLinkURL(e.target.value)}
              value={newLinkURL}
              className='ml-3 focus:outline-none text-gray-400 overflow-ellipsis'
              type='textarea'
              placeholder='Link URL'
            ></input>
            <div className='flex mx-5'>
              {linkEmojis.map((emoji) => {
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
              <button onClick={() => save()} className='text-gray-500 mr-5'>
                ✅
              </button>
              <button onClick={exit} className='text-gray-500'>
                ❌
              </button>
            </>
          )}
        </div>
      </div>
      {editing && (
        <div className='border-2 shadow-sm rounded-xl p-2 px-3 mb-3 w-min'>
          <div>
            <div className='flex items-center'>
              <div className='mr-5'>
                <div className='flex'>
                  <input
                    onChange={(e) => setNewEventInfo({ ...newEventInfo, title: e.target.value })}
                    value={newEventInfo.title}
                    className='focus:outline-none overflow-ellipsis font-bold'
                    type='textarea'
                    placeholder='Event title'
                  ></input>
                  <input
                    onChange={(e) => setNewEventInfo({ ...newEventInfo, link: e.target.value })}
                    value={newEventInfo.link}
                    className='ml-3 focus:outline-none text-gray-400 overflow-ellipsis'
                    type='textarea'
                    placeholder='Event link'
                  ></input>
                  <input
                    onChange={(e) => {
                      setNewEventInfo({ ...newEventInfo, date: e.target.value })
                    }}
                    value={newEventInfo.date}
                    className='ml-3 border-gray-200 rounded-full focus:outline-none text-gray-400 overflow-ellipsis'
                    type='date'
                    placeholder='Event link'
                  ></input>
                  <input
                    onChange={(e) => setNewEventInfo({ ...newEventInfo, time: e.target.value })}
                    value={newEventInfo.time}
                    className='ml-3 px-3 border border-gray-200 rounded-full text-gray-400 overflow-ellipsis'
                    type='time'
                    placeholder='Event time'
                  ></input>
                </div>
                <div className='flex justify-between py-3'>
                  <input
                    onChange={(e) => setNewEventInfo({ ...newEventInfo, description: e.target.value })}
                    value={newEventInfo.description}
                    className='focus:outline-none overflow-ellipsis'
                    type='textarea'
                    placeholder='Event description'
                  ></input>
                  <div>
                    {eventEmojis.map((emoji) => {
                      return (
                        <button
                          onClick={(e) => setNewEventInfo({ ...newEventInfo, emoji: e.target.value })}
                          key={emoji}
                          value={emoji}
                          className={classNames(
                            'px-1 border-2 border-gray-50 rounded-md hover:bg-gray-300',
                            emoji === newEventInfo.emoji ? 'bg-gray-300 border-gray-300' : ''
                          )}
                        >
                          {emoji}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className='border-l-2 ml-3'>
                <button className='rounded-lg p-1 px-3 ml-3 hover:bg-gray-200' onClick={addNewEvent}>
                  ✚
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='flex'>
        {!loading && (
          <>
            <div className='w-2/3'>
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
                    <li
                      key={link.title}
                      className='border-2 border-gray-100 rounded-xl p-2 mb-2 w-max flex items-center'
                    >
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
            <div className='border-l-2 p-5'>
              <ul className='text-gray=700 p-5'>
                {newEvents.map((event) => {
                  return (
                    <li key={event.id} draggable className='w-60 border-2 border-gray-100 rounded-xl p-2 mb-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='px-2'>{event.emoji}</div>
                          <a className='px-2 border-l-2 hover:underline text-gray-500 font-bold' href={event.link}>
                            {event.title}
                          </a>
                        </div>
                        {editing && (
                          <button className='rounded-lg p-1 hover:bg-gray-200' onClick={() => deleteEvent(event)}>
                            ❌
                          </button>
                        )}
                      </div>
                      <div>
                        <div className='flex'>
                          <p className='text-gray-400 mr-3'>{formatDate(event.date)}</p>
                          <p className='text-gray-400'>{event.time}</p>
                        </div>
                        <p className='text-gray-700'>{event.location}</p>
                        <p className='text-gray-700 pb-3'>{event.description}</p>
                        {/* <button className='border hover:bg-gray-100 rounded-xl p-2 text-gray-400 '>
                      <a
                        className='flex align-middle justify-center'
                        href={googleCalLink(emptyEvent(0))}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image width='20' height='20' src='/googleCal.png'></Image>
                      </a>
                    </button> */}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
