import { gql } from '@apollo/client'

export const ADD_COMPANY = gql`
  mutation addCompany($name: String!, $website: String!,  $telephone: Int! ){
    addCompany(name: $name, website: $website, telephone: $telephone ){
      company{
        id
        name
        website
        telephone
      }
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompany($id:ID!, $name: String! ){
    updateCompany(id: $id, name: $name){
      company{
        id
        name
        website
        telephone
      }
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation deleteCompany($id:Int!){
    deleteCompany(id:$id){
      company{
        id
      }
    }
  }
`;
