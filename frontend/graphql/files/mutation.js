import { gql } from '@apollo/client'

export const UPLOAD_FILE = gql`
 mutation uploadFile($file: Upload!, $userID: Int!){
   uploadFile(file:$file, userID:$userID){
     success
   }
 }
`