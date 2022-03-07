import { useRouter } from 'next/router'
import axios from 'axios'
import { Formik, Form } from 'formik'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import 'yup-phone'
import { TextInput } from '../../components/TextInput'
import { ProjectInput } from '../../components/ProjectInput'
import Image from 'next/image'
import filledTriangle from '../../public/filled-triangle.png'
import Link from 'next/link'
import { HelpOffers } from '../../components/NewTable'
import { HelpAsks } from '../../components/NewTable'
import { classNames } from '../../components/shared/Utils'
import { Collapse } from 'react-collapse'
import Autocomplete from '@mui/material/Autocomplete'
import ReactTooltip from 'react-tooltip'
import questionIcon from '../../public/questionIcon.svg'
import { styled } from '@mui/material/styles'
import { boolean } from 'yup/lib/locale'
import { FormCheckbox } from '../../components/FormCheckbox'
import { AutocompleteField } from '../../components/AutocompleteField'

export default function Onboarding() {
  const router = useRouter()

  const [addProject, setAddProject] = useState(true)
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState('')
  const [buttonElement, setButtonElement] = useState('')
  const [error, setError] = useState('')

  const phoneQuery = router.asPath.split('/')[2].toString()
  const [phoneNum, setPhoneNum] = useState()
  const [token, setToken] = useState(null)

  const [offers, setOffers] = useState([])
  const [asks, setAsks] = useState([])
  const [offersDropdown, setOffersDropdown] = useState(false)
  const [asksDropdown, setAsksDropdown] = useState(false)

  const [industries, setIndustries] = useState([])
  const [interests, setInterests] = useState([])
  const [value, setValue] = useState([])
  const [industryValue, setIndustryValue] = useState('')

  const [userData, setUserData] = useState({})

  useEffect(async () => {
    if (phoneQuery) {
      setPhoneNum(phoneQuery)
      await fetch('/api/getUserData', {
        method: 'POST',
        body: phoneQuery
      })
        .then((res) => res.json())
        .then((result) => {
          setUserData(result)
          setIndustryValue(result.industry)
          setValue(result.interests)
          setOffers(result.offers)
          setAsks(result.asks)
          setProjects(result.projects)
        })
      await fetch('/api/autocomplete/getIndustries', {
        method: 'POST',
        headers: { communityId: 'test' }
      })
        .then((res) => res.json())
        .then((result) => {
          setIndustries(result.industries)
        })

      await fetch('/api/autocomplete/getInterests', {
        method: 'POST',
        headers: { communityId: 'test' }
      })
        .then((res) => res.json())
        .then((result) => {
          setInterests(result.interests)
        })
    }
  }, [phoneQuery])

  const interestsUpdate = async (interest) => {
    await axios
      .post('/api/autocomplete/interests', {
        newInterest: interest,
        communityId: 'test'
      })
      .then((res) => {
        setError('')
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data)
        }
      })
  }

  const validateLink = () => {
    let pattern = (pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    ))
    return !pattern.test(newProject)
  }

  function projectAdd() {
    if (projects.includes(newProject)) {
      setButtonElement('Project already exists!')
    } else if (newProject === '') {
      setButtonElement('Enter a project')
    } else if (validateLink()) {
      setButtonElement('Not a valid link')
    } else {
      setProjects([...projects, newProject])
      setButtonElement('')
    }
  }

  function addCard() {
    setAddProject(false)
  }

  function removeProject(project, e) {
    e.preventDefault()
    setProjects(projects.filter((c) => c !== project))
  }

  async function login(values) {
    if (!phoneNum || phoneNum.length < 9) {
      setError('Please input a valid phone number.')
      return
    }
    await axios
      .post('/api/update', {
        ...userData,
        phoneNum: phoneQuery,
        offers: offers,
        asks: asks,
        projects: projects,
        industry: industryValue,
        interests: value.map((string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()),
        updated: new Date().toLocaleString().split(',')[0]
      })
      .then((res) => {
        setError('')
        if (res.status === 200) {
          router.push({
            pathname: '/'
          })
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.msg === 'needs to make account') {
        } else if (error.response && error.response.data) {
          setError(error.response.data)
        }
      })
  }

  const offerClick = (e, offer) => {
    if (offers.includes(offer.value)) {
      setOffers(offers.filter((item) => item !== offer.value))
    } else {
      setOffers([...offers, offer.value])
    }
  }

  const asksClick = (e, ask) => {
    if (asks.includes(ask.value)) {
      setAsks(asks.filter((item) => item !== ask.value))
    } else {
      setAsks([...asks, ask.value])
    }
  }

  const requiredError = 'Required'
  const charError = 'Must be 40 characters or less'

  const StyledAutocomplete = styled(Autocomplete)({
    '& .MuiAutocomplete-inputRoot': {
      color: 'black',
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid #e2e8f0',
        borderRadius: '7px'
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          border: '2px solid red'
        }
      }
    }
  })

  return (
    <div className='h-fit min-h-screen py-14 flex flex-col bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg drop-shadow pt-10 pb-5 px-16'>
        <div>
          <Formik
            initialValues={{
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              location: userData.location,
              work: userData.work,
              role: userData.role,
              projects: userData.projects,
              offers: userData.offers,
              asks: userData.asks,
              industry: userData.industry,
              interests: userData.interests,
              targetedBump: userData.targetedBump,
              randomBump: userData.randomBump
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true)
              await login()
            }}
          >
            {(formikProps) => (
              <Form
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                  🏡 Update your information for {phoneNum === '[token]' ? phoneQuery : phoneNum}.
                </h1>
                <div style={{ margin: '0 20px', textAlign: 'center' }}></div>
                <div>
                  <TextInput
                    label='First Name'
                    name='firstName'
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                    type='text'
                    placeholder='First name'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Last Name'
                    name='lastName'
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                    type='text'
                    placeholder='Last name'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Email Address'
                    name='email'
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    type='email'
                    placeholder='Email'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Location'
                    name='location'
                    value={userData.location}
                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                    type='text'
                    placeholder='Location'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Work'
                    name='work'
                    value={userData.work}
                    onChange={(e) => setUserData({ ...userData, work: e.target.value })}
                    type='text'
                    placeholder='Work'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <TextInput
                    label='Role'
                    name='role'
                    value={userData.role}
                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                    type='role'
                    placeholder='Role'
                    className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
                  />
                  <div className='mr-auto mb-2'>
                    {projects.map((project) => (
                      <div key={project} className='flex justify-between'>
                        <a href={project} className='underline'>
                          {project}
                          <br />
                        </a>
                        <button type='button' className='ml-auto' onClick={(e) => removeProject(project, e)}>
                          ❌
                        </button>
                        <br />
                      </div>
                    ))}
                  </div>
                  {addProject ? (
                    <button
                      style={{ border: '1px solid #1d4ed8' }}
                      className='py-1 font-bold mb-3 mr-auto px-2 text-sm rounded focus:outline-none focus:border-green-dark hover:bg-blue-hover'
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
                  <div className='py-3'>
                    <div
                      onClick={() => setOffersDropdown(!offersDropdown)}
                      className='cursor-pointer flex items-center'
                    >
                      <div className='font-bold ml-1 mr-2'>Offers</div>
                      <div style={{ transform: offersDropdown ? 'rotate(180deg)' : '' }}>
                        <div className={`${offersDropdown && 'hidden'} w-1 h-1`} />
                        <Image src={filledTriangle} alt='triangle' height={14} width={14} />
                      </div>
                    </div>
                    <Collapse isOpened={offersDropdown}>
                      {HelpOffers.map((offer) => {
                        return (
                          <button type='button' key={offer.text} onClick={(e) => offerClick(e, offer)}>
                            <div
                              className={classNames(
                                'my-1 mx-0.5 px-3 py-1 w-max uppercase leading-wide font-bold text-xs rounded-full shadow-sm ',
                                'hover:' + offer.color,
                                offers.includes(offer.value) ? offer.color + ' border-2 border-blue' : 'bg-gray-100'
                              )}
                            >
                              {offer.emoji} {offer.text}
                            </div>
                          </button>
                        )
                      })}
                    </Collapse>
                  </div>
                  <div className='pb-3'>
                    <div onClick={() => setAsksDropdown(!asksDropdown)} className='cursor-pointer flex items-center'>
                      <div className='font-bold ml-1 mr-2'>Asks</div>
                      <div style={{ transform: asksDropdown ? 'rotate(180deg)' : '' }}>
                        <div className={`${asksDropdown && 'hidden'} w-1 h-1`} />
                        <Image src={filledTriangle} alt='triangle' height={14} width={14} />
                      </div>
                    </div>
                    <Collapse isOpened={asksDropdown}>
                      {HelpAsks.map((ask) => (
                        <button type='button' key={ask.text} onClick={(e) => asksClick(e, ask)}>
                          <div
                            className={classNames(
                              'my-1 mx-0.5 px-3 py-1 w-max uppercase leading-wide font-bold text-xs rounded-full shadow-sm ',
                              'hover:' + ask.color,
                              asks.includes(ask.value) ? ask.color + ' border-2 border-blue' : 'bg-gray-100'
                            )}
                          >
                            {ask.emoji} {ask.text}
                          </div>
                        </button>
                      ))}
                    </Collapse>
                  </div>
                  <div className='mt-4'>
                    <StyledAutocomplete
                      disablePortal
                      value={industryValue}
                      onChange={(event, newValue) => {
                        setIndustryValue(newValue)
                      }}
                      size='small'
                      options={industries.map((option) => option)}
                      renderInput={(params) => (
                        <AutocompleteField
                          size='small'
                          params={params}
                          placeholder='Industry'
                          label='Industry'
                          type='text'
                          name='industry'
                        />
                      )}
                    />
                  </div>
                  <div className='mt-4'>
                    <StyledAutocomplete
                      multiple
                      disablePortal
                      freeSolo
                      size='small'
                      options={interests.map((option) => option)}
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue)
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      renderOption={(props, option) => <li {...props}>{option}</li>}
                      renderInput={(params) => (
                        <AutocompleteField
                          size='small'
                          params={params}
                          placeholder='Interests'
                          label='Interests'
                          type='text'
                          name='interests'
                        />
                      )}
                    />
                  </div>
                  <div className='flex items-center mt-4'>
                    <FormCheckbox
                      className='mr-2 p-2 bg-gray-light rounded-md outline-none'
                      type='checkbox'
                      label='Targeted Bump'
                      checked={userData.targetedBump}
                      onClick={(e) => setUserData({ ...userData, targetedBump: e.target.checked })}
                      placeholder='Targeted Bump'
                      name='targetedBump'
                    />
                    <p className='mr-1'>Targeted matching</p>
                    <Image data-tip data-for='matchedBumps' src={questionIcon} />
                    <ReactTooltip style={{ width: '100px' }} id='matchedBumps' type='dark' effect='solid'>
                      <div style={{ width: '150px' }} className='whitespace-normal'>
                        You get matched with others within the community based on your needs, location, interests,
                        industry, etc.
                      </div>
                    </ReactTooltip>
                  </div>
                  <div className='flex items-center'>
                    <FormCheckbox
                      className='mr-2 p-2 bg-gray-light rounded-md outline-none'
                      type='checkbox'
                      name='randomBump'
                      checked={userData.randomBump}
                      onClick={(e) => setUserData({ ...userData, randomBump: e.target.checked })}
                      label='Random Bump'
                      placeholder='Random Bump'
                    />
                    <p className='mr-1'>Random matching</p>
                    <Image data-tip data-for='randomBumps' src={questionIcon} />
                    <ReactTooltip style={{ width: '100px' }} id='randomBumps' type='dark' effect='solid'>
                      <div style={{ width: '150px' }} className='whitespace-normal'>
                        You'll get matched with people within the community at random.
                      </div>
                    </ReactTooltip>
                  </div>
                </div>
                <div onClick={() => interestsUpdate(value)} style={{ margin: '0 20px 20px 20px', textAlign: 'center' }}>
                  <button
                    className='bg-blue py-2 px-4 text-white rounded-full font-medium mt-4  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                    type='submit'
                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                  >
                    {formikProps.isSubmitting ? 'loading...' : ' Update information'}
                  </button>
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
