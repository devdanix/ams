import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

// Graphql
import { UPLOAD_FILE } from '../../graphql/files/mutation'

// Custom Hooks
import { useCleanMutation } from '../../graphql/hooks/useCleanMutation.js';


export default function MyDropzone({
  query = '',
  queryVariables = '',
  userID = ''
}) {

  const uploadFile = useCleanMutation(UPLOAD_FILE, {
    refetchQueries: [{
      query: query,
      variables: queryVariables
    }]
  })

  const onDrop = useCallback(([file]) => {
    uploadFile({file, userID})
  }, [uploadFile])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps({className: 'dropzone'})}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}
