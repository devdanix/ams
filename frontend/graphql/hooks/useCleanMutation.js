import { useMutation } from '@apollo/client'

export const useCleanMutation = (graphqlQuery, options) => {
  const [ mutate ] = useMutation(graphqlQuery, options)

  return (vars) => {
    let localVars = {...vars}
    Object.keys(localVars).forEach((element) => {
      if (!isNaN(localVars[element]) && typeof(localVars[element]) !== 'boolean') {
        localVars[element] = parseInt(localVars[element])
      }
    });
    return mutate({ variables : localVars })
  }
}