import { useField } from 'formik'

export const ProjectInput = ({ errorStyle, newLink, setNewLink, projectAdd, buttonElement}) => {

  return (
    <>
      <div className='flex items-center w-full'>
        <input
          className='mt-2 w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
          value={newLink}
          placeholder='Add a link'
          onChange={(e) => setNewLink(e.target.value)}
        />
        <button className='ml-2 h-6 w-6 mb-2' onClick={projectAdd}>
          ✅
        </button>
      </div>
      {buttonElement !== '' ? (
        <div
          style={
            errorStyle
              ? errorStyle
              : { marginTop: '-1rem', marginBottom: '0.5rem', fontSize: '12px', textAlign: 'center', color: 'red' }
          }
        >
          {buttonElement}
        </div>
      ) : null}
    </>
  )
}
