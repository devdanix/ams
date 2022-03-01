import { gql } from '@apollo/client'

export const GET_COMPANIES = gql`
  query allCompanies{
    allCompanies {
      id,
      name,
      website,
      telephone
    }
  }
`;

export const GET_COMPANY = gql`
  query singleCompany($id: Int!){
    singleCompany(id: $id){
      id,
      name,
      website,
      telephone
    }
  }
`;

