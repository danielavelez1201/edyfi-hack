import { useField } from 'formik'

export const TextArea = ({ label, errorStyle, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <textarea wrap='soft' style={{ resize: 'none', height: '100px' }} {...field} {...props} />
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
