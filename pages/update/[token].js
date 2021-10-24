import { useRouter } from 'next/router'
import axios from 'axios'
import { Formik, Form } from 'formik'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import 'yup-phone'
import { TextInput } from '../../components/TextInput'
import { ProjectInput } from '../../components/ProjectInput'
import { TextArea } from '../../components/TextArea'

export default function Onboarding() {
  const router = useRouter()
    const [user, setUser] = useState()
    const router = useRouter()
    const { token } = router.query
  const communityId = router.asPath.split('/')[2]

  useEffect(() => {
    if (!router.isReady) return
    console.log({ query: router.query })
    axios.post('/api/getUpdateRequest', { token: router.query.token }).then((res) => {
      console.log({ res })
      setUser(res.data.user)
    })
  }, [router.query, router.isReady])

  const [addProject, setAddProject] = useState(true)
  const [projects, setProjects] = useState(user.projects)
  const [newProject, setNewProject] = useState('')
  const [buttonElement, setButtonElement] = useState('')
  const [refer, setRefer] = useState(user.refer)
  const [error, setError] = useState('')

  function projectAdd() {
    if (projects.includes(newProject)) {
      setButtonElement('Project already exists!')
    } else if (newProject === '') {
      setButtonElement('Enter a project')
    } else {
      setProjects([...projects, newProject])
      setButtonElement('')
    }
  }

  function addCard() {
    setAddProject(false)
  }

  function removeProject(project) {
    setProjects(projects.filter((c) => c !== project))
  }

  const requiredError = 'Required'
  const charError = 'Must be 40 characters or less'

  return (
    <div className='h-full py-14 flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      {user && (
        <div class='w-full max-w-md m-auto bg-white rounded-lg drop-shadow pt-10 pb-5 px-16'>
          <div>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                location: '',
                work: '',
                role: '',
                projects: [],
                refer: '',
                asks: '',
                token: '',
                communityId: communityId
              }}
              validationSchema={Yup.object({
                firstName: Yup.string().max(40, charError).required(requiredError),
                lastName: Yup.string().max(40, charError).required(requiredError),
                email: Yup.string().email('Invalid email address').required(requiredError),
                phone: Yup.string().phone('Enter a valid phone including +country code').required(requiredError),
                location: Yup.string().max(40, charError).required(requiredError),
                work: Yup.string().max(40, charError).required(requiredError),
                role: Yup.string().max(40, charError).required(requiredError)
              })}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)
                await axios
                  .post('/api/signup', {
                    ...values,
                    headers: { communityId: communityId },
                    projects: projects,
                    refer: refer,
                    updated: new Date().toLocaleString().split(',')[0],
                    token
                  })
                  .then((res) => {
                    console.log(res)
                    setError('')
                    if (res.status === 200) {
                      setSubmitting(true)
                      router.push({
                        pathname: '/home',
                        query: { communityId: communityId }
                      })
                    }
                    setSubmitting(false)
                  })
                  .catch((error) => {
                    if (error.response) {
                      console.log(error.response.data)
                      setError(error.response.data)
                    }
                  })
              }}
            >
              {(formikProps) => (
                <Form
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                    🏡 Join as a member of community {communityId}.
                  </h1>

                  <div style={{ margin: '0 20px', textAlign: 'center' }}></div>
                  <TextInput
                    label='First Name'
                    name='firstName'
                    type='text'
                    placeholder='First name'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Last Name'
                    name='lastName'
                    type='text'
                    placeholder='Last name'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Email Address'
                    name='email'
                    type='email'
                    placeholder='Email'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Phone'
                    name='phone'
                    type='text'
                    placeholder='Phone'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Location'
                    name='location'
                    type='text'
                    placeholder='Location'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Work'
                    name='work'
                    type='text'
                    placeholder='Work'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Role'
                    name='role'
                    type='role'
                    placeholder='Role'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <div className='flex flex-col w-full text-center text-sm'>
                    Can you give a referral?
                    <div className='w-full flex justify-evenly mb-4 mt-1'>
                      <button
                        type='button'
                        onClick={() => setRefer(true)}
                        style={{ border: '1px solid #1d4ed8' }}
                        className={`${refer ? 'bg-blue' : ''} shadow hover:bg-blue rounded-full w-full py-1 mr-2`}
                      >
                        ✅
                      </button>
                      <button
                        type='button'
                        onClick={() => setRefer(false)}
                        style={{ border: '1px solid #1d4ed8' }}
                        className={`${!refer ? 'bg-blue' : ''} shadow hover:bg-blue rounded-full w-full py-1 ml-2`}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                  <div className='mr-auto'>
                    {projects.map((project) => (
                      <a key={project} href={project} className='underline'>
                        {project}
                        {/* <button
                      type='button'
                      className='ml-1'
                      onClick={(e) => e.key === 'Enter' && e.preventDefault() && removeProject(project)}
                    >
                      ❌
                    </button> */}
                        <br />
                      </a>
                    ))}
                  </div>
                  {addProject ? (
                    <button
                      style={{ border: '1px solid #1d4ed8' }}
                      className='py-1 mb-3 mr-auto px-2 text-sm rounded focus:outline-none focus:border-green-dark hover:bg-blue-hover'
                      onClick={addCard}
                    >
                      Add a project <span style={{ fontSize: '18px' }}>+</span>
                    </button>
                  ) : (
                    <ProjectInput
                      newLink={newProject}
                      setNewLink={setNewProject}
                      projectAdd={projectAdd}
                      buttonElement={buttonElement}
                      type='text'
                      placeholder='link'
                    />
                  )}
                  <TextArea
                    label='Asks'
                    name='asks'
                    type='asks'
                    placeholder='Any asks?'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Token'
                    name='token'
                    type='text'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                    placeholder='Community token'
                  />
                  <div style={{ margin: '0 20px 20px 20px', textAlign: 'center' }}>
                    <button
                      className='bg-blue py-2 px-4 text-white rounded-full font-medium mt-4  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                      type='submit'
                      disabled={formikProps.isSubmitting || !formikProps.isValid}
                    >
                      {formikProps.isSubmitting ? 'loading...' : 'Join community'}
                    </button>
                    <br></br>
                    <br></br>
                    <h1 className='text-red'>{error}</h1>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  )
}
