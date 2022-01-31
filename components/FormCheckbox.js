import { useField } from 'formik'

export const FormCheckbox = ({ label, errorStyle, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <div
          style={
            errorStyle
              ? errorStyle
              : { marginTop: '-1rem', marginBottom: '0.5rem', fontSize: '12px', textAlign: 'center', color: 'red' }
          }
        >
          {meta.error}
        </div>
      ) : null}
    </>
  )
}
