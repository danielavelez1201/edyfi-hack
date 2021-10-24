import { useRouter } from 'next/router'
import axios from 'axios'
import { Formik, Form } from 'formik'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import 'yup-phone'
import { TextInput } from '../../components/TextInput'

export default function Onboarding() {
  const router = useRouter()
  const communityId = router.asPath.split('/')[2]

  const [addProject, setAddProject] = useState(true)
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState('')
  const [buttonElement, setButtonElement] = useState('')
  const [error, setError] = useState('')
  console.log(communityId)

  function projectEnter(event) {
    if (event.key === 'Enter') {
      projectAdd()
    }
  }

  function projectAdd() {
    if (projects.includes(newProject)) {
      setButtonElement('Choice Already Exists!')
    } else if (newProject === '') {
      setButtonElement('Enter Something')
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
    <div className='h-full flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div class='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
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
            refer: 'yes', // TODO: change to select or checkbox
            token: '',
            communityId: communityId,
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().max(40, charError).required(requiredError),
            lastName: Yup.string().max(40, charError).required(requiredError),
            email: Yup.string().email('Invalid email address').required(requiredError),
            phone: Yup.string().phone('Enter a valid phone including +country code').required(requiredError),
            location: Yup.string().max(40, charError).required(requiredError),
            work: Yup.string().max(40, charError).required(requiredError),
            role: Yup.string().max(40, charError).required(requiredError),
            projectName: Yup.string().max(40, charError).required(requiredError),
            projectLink: Yup.string().max(40, charError).required(requiredError),
            refer: Yup.string().oneOf(['yes', 'no'])
          })}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("submitted")
            await axios.post('/api/signup', {
              ...values,
              headers: {communityId: communityId}
            }).then((res) => {
              console.log(res)
              setError("")
              if (res.status === 200) {
                setSubmitting(true)
                router.push({
                    pathname: '/home',
                    query: {communityId: communityId}
                })
            }
            setSubmitting(false)}).catch((error) => {
              if (error.response) {
                console.log(error.response.data);
                setError(error.response.data)
              }
             })
          }}
        >
          {(formikProps) => (
            <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h1 class='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                🏡 Join as a member of community {communityId}.
              </h1>

              <div style={{ margin: '0 20px', textAlign: 'center' }}></div>
              <TextInput label='First Name' name='firstName' type='text' placeholder='first name' class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'/>
              <TextInput label='Last Name' name='lastName' type='text' placeholder='last name'class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
              <TextInput label='Email Address' name='email' type='email' placeholder='email' class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'/>
              <TextInput label='Phone' name='phone' type='text' placeholder='phone' class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'/>
              <TextInput label='Location' name='location' type='text' placeholder='location'class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
              <TextInput label='Work' name='work' type='text' placeholder='work' class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'/>
              <TextInput label='Role' name='role' type='role' placeholder='role'class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
              <div className='mt-2'>
                {projects.map((project) => (
                  <div className='flex'>
                    <TextInput label='Project Name' name='projectName' type='text' placeholder='name' class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'/>
                    <TextInput label='Project Link' name='projectLink' type='text' placeholder='link' class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'/>
                  </div>
                ))}
              </div>
              <div className='my-1 ml-1 '>
                {addProject ? (
                  <button className='bg-cyan py-2 px-4 text-sm text-white rounded focus:outline-none focus:border-green-dark hover:bg-blue-hover' onClick={addCard}>
                    Add a project
                  </button>
                ) : (
                  <>
                    <div className='flex'>
                      <input
                        className='border-b border-gray w-4/5'
                        onKeyPress={projectEnter}
                        value={newProject}
                        placeholder='Type here...'
                        onChange={(e) => setNewProject(e.target.value)}
                      />
                      <button className='ml-3' onClick={projectAdd}>
                        <div className='h-6 w-6'>✅</div>
                      </button>
                    </div>
                    <div className='text-sm text-red-300'>{buttonElement}</div>
                  </>
                )}
              </div>
              <TextInput label='Refer' name='refer' type='text' placeholder='refer' class='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'/>
              <TextInput label='Token' name='token' type="text" className ="w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" placeholder="community token"/>
              <div style={{ margin: '0 20px 20px 20px', textAlign: 'center' }}>
                <button
                  class='bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                  type='submit'
                  disabled={formikProps.isSubmitting || !formikProps.isValid}
                >
                  {formikProps.isSubmitting ? 'loading...' : 'Join community'}
                </button>
                <br></br>
                <br></br>
                <h1 className="text-red">{error}</h1>
              </div>
            </Form>
          )}
        </Formik>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}
