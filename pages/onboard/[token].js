import { useRouter } from 'next/router'
import axios from 'axios'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import 'yup-phone'
import { TextInput } from '../../components/TextInput'

export default function Onboarding() {
  const router = useRouter()
  const communityId = router.asPath.split('/')[2]

  return (
    <div className="h-screen flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light">
    <div class='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          workingAt: '',
          referral: 'yes', // TODO: change to select or checkbox
          communityId: communityId
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().max(40, '^ Must be 40 characters or less').required('^ Required'),
          lastName: Yup.string().max(40, '^ Must be 40 characters or less').required('^ Required'),
          email: Yup.string().email('^ Invalid email address').required('^ Required'),
          phone: Yup.string().phone('^ Enter a valid phone including +country code').required('^ Required'),
          location: Yup.string().max(40, '^ Must be 40 characters or less').required('^ Required'),
          workingAt: Yup.string().max(40, '^ Must be 40 characters or less').required('^ Required'),
          referral: Yup.string().oneOf(['yes', 'no'])
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true)
          await axios.post('/api/signup', {
            ...values
          })
          setSubmitting(false)
        }}
      >
        {(formikProps) => (

          <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h1 class="text-2xl font-medium text-primary mt-4 mb-12 text-center">🏡 Join as a member of community {communityId}.</h1>

            <div style={{ margin: '0 20px', textAlign: 'center' }}></div>
            <TextInput label='First Name' name='firstName' type='text' placeholder='First name' class='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
            <TextInput label='Last Name' name='lastName' type='text' placeholder='Last name' class='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
            <TextInput label='Email Address' name='email' type='email' placeholder='Email' class='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
            <TextInput label='Phone' name='phone' type='text' placeholder='Phone' class='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
            <TextInput label='Location' name='location' type='text' placeholder='Location' class='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
            <TextInput label='Working at' name='workingAt' type='text' placeholder='Working at' class='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
            <TextInput label='referral' name='referral' type='text' placeholder='Referral' class='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4' />
            <div style={{ margin: '0 20px 20px 20px', textAlign: 'center' }}>
              <button
                class='bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                type='submit'
                disabled={formikProps.isSubmitting || !formikProps.isValid}
              >
                {formikProps.isSubmitting ? 'loading...' : 'Join community'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
  )
}
