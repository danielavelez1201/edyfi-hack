import { useRouter } from 'next/router'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import 'yup-phone'
import { TextInput } from '../../componenets/TextInput'

export default function Onboarding() {
  const router = useRouter()

  console.log({ query: router.query })

  return (
    <div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          workingAt: '',
          referral: true
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
          // await fetch()
          setSubmitting(false)
        }}
      >
        {(formikProps) => (
          <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ margin: '0 20px', textAlign: 'center' }}>
              {/* {betaSignUpData.data?.betaSignUp}
                {betaSignUpData.error && betaSignUpData.error.message.replace('GraphQL error: ', '')} */}
            </div>
            <TextInput label='First Name' name='firstName' type='text' placeholder='first name' />
            <TextInput label='Last Name' name='lastName' type='text' placeholder='last name' />
            <TextInput label='Email Address' name='email' type='email' placeholder='email' />
            <TextInput label='Phone' name='phone' type='text' placeholder='phone' />
            <TextInput label='Location' name='location' type='text' placeholder='location' />
            <TextInput label='Working at' name='workingAt' type='text' placeholder='working at' />
            <TextInput label='referral' name='referral' type='text' placeholder='referral' />
            <div style={{ margin: '0 20px 20px 20px', textAlign: 'center' }}>
              <div type='submit' disabled={formikProps.isSubmitting || !formikProps.isValid}>
                {formikProps.isSubmitting ? 'loading...' : 'sign up'}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
