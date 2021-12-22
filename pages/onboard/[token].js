import { useRouter } from 'next/router'
import axios from 'axios'
import { Formik, Form } from 'formik'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import 'yup-phone'
import { TextInput } from '../../components/TextInput'
import { ProjectInput } from '../../components/ProjectInput'
import { TextArea } from '../../components/TextArea'
import { hashcode } from '../api/helpers'
import { GoogleSignIn } from '../components/googleSignIn'
import Image from 'next/image'
import { signInWithGoogle } from '../../firebase/clientApp'
import { useUser } from '../../firebase/useUser'
import Google from '../../img/Google.png'

export default function Onboarding() {
  const router = useRouter()
  const communityId = router.asPath.split('/')[2]

  const [addProject, setAddProject] = useState(true)
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState('')
  const [buttonElement, setButtonElement] = useState('')
  const [refer, setRefer] = useState(false)
  const [error, setError] = useState('')
  const [phoneNum, setPhoneNum] = useState(null)
  const [token, setToken] = useState(null)

  const [showForm, setShowForm] = useState(false)

  const { user } = useUser()

  const googleTextStyle = user ? 'text-center ml-5 text-cyan' : 'text-center ml-5'

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

  async function login(values) {
    if (!phoneNum || phoneNum.length < 9) {
      setError('Please input a valid phone number.')
      return
    }
    console.log('clicked login')
    await axios
      .post('/api/signup', {
        ...values,
        headers: { communityId: communityId, googleUser: user, phoneNum: phoneNum, token: token },
        projects: projects,
        refer: refer,
        updated: new Date().toLocaleString().split(',')[0]
      })
      .then((res) => {
        console.log(res)
        setError('')
        if (res.status === 200) {
          console.log('res status 200')
          console.log(token)
          console.log(hashcode(token))
          router.push({
            pathname: '/home',
            query: { communityId: communityId, token: hashcode(token) }
          })
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.msg === 'needs to make account') {
          setShowForm(true)
        } else if (error.response && error.response.data) {
          console.log(error.response.data)
          setError(error.response.data)
        }
      })
  }

  const requiredError = 'Required'
  const charError = 'Must be 40 characters or less'

  return (
    <div className='h-full py-14 flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg drop-shadow pt-10 pb-5 px-16'>
        <div>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              phone: phoneNum,
              location: '',
              work: '',
              role: '',
              projects: [],
              refer: '',
              asks: '',
              token: token,
              communityId: communityId,
              googleUser: user
            }}
            validationSchema={Yup.object({
              firstName: Yup.string().max(40, charError).required(requiredError),
              lastName: Yup.string().max(40, charError).required(requiredError),
              email: Yup.string().email('Invalid email address').required(requiredError),
              //phone: Yup.string().phone('Enter a valid phone including +country code').required(requiredError),
              location: Yup.string().max(40, charError).required(requiredError),
              work: Yup.string().max(40, charError).required(requiredError),
              role: Yup.string().max(40, charError).required(requiredError)
            })}
            onSubmit={async (values, { setSubmitting }) => {
              console.log('in onSubmit')
              setSubmitting(true)
              await login(values)
            }}
          >
            {(formikProps) => (
              <Form
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                  🏡 Join as a member of community {communityId}.
                </h1>
                {!showForm && (
                  <>
                    <input
                      label='Phone'
                      name='phone'
                      type='text'
                      placeholder='Phone'
                      onChange={(e) => {
                        setError('')
                        setPhoneNum(e.target.value)
                      }}
                      className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                    ></input>
                    <input
                      label='Token'
                      name='token'
                      type='text'
                      className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                      onChange={(e) => {
                        setError('')
                        setToken(e.target.value)
                      }}
                      placeholder='Community token'
                    ></input>

                    <button
                      className='focus:outline-none flex items-center h-9 justify-left rounded-xl p-5 border-black border border-cyan'
                      onClick={signInWithGoogle}
                      type='button'
                    >
                      <Image alt="don't be evil" height={24} width={24} src={Google} />
                      {user && <div className={googleTextStyle}>Google account connected!</div>}
                      {!user && <div className={googleTextStyle}>Connect your Google account</div>}
                    </button>
                    {!user && (
                      <>
                        <br></br>
                        <h className='text-sm'>
                          Sign in with Google to sync and protect your info across all your communities.
                        </h>
                      </>
                    )}
                    <br></br>
                  </>
                )}
                {!showForm && (
                  <button
                    className='bg-blue py-2 px-4 text-white rounded-full font-medium mt-4  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                    onClick={async () => {
                      await login({})
                    }}
                    type='button'
                  >
                    Continue
                  </button>
                )}
                <div style={{ margin: '0 20px', textAlign: 'center' }}></div>
                {showForm && (
                  <div>
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
                  </div>
                )}
                <div style={{ margin: '0 20px 20px 20px', textAlign: 'center' }}>
                  {showForm && (
                    <button
                      className='bg-blue py-2 px-4 text-white rounded-full font-medium mt-4  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                      type='submit'
                      disabled={formikProps.isSubmitting || !formikProps.isValid}
                    >
                      {formikProps.isSubmitting ? 'loading...' : 'Join community'}
                    </button>
                  )}
                  <br></br>
                  <br></br>
                  <h1 className='text-red'>{error}</h1>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div></div>
      </div>
    </div>
  )
}
