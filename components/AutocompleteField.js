import { useField } from 'formik'
import TextField from '@mui/material/TextField'

export const AutocompleteField = ({ label, errorStyle, params, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <TextField {...field} {...props} {...params} />
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
