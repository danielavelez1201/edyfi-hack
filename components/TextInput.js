import { useField } from 'formik'

export const TextInput = ({ label, errorStyle, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <div style={errorStyle ? errorStyle : { paddingTop: '9px', margin: '0px 25px', textAlign: 'center' }}>
          {meta.error}
        </div>
      ) : null}
    </>
  )
}
