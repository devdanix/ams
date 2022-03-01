import graphene
import graphql_jwt

import users.schema
import events.schema
import companies.schema

class Query(
    users.schema.Query,
    events.schema.Query,
    companies.schema.Query,
    graphene.ObjectType):
    pass

class Mutation(
    users.schema.Mutation,
    events.schema.Mutation,
    companies.schema.Mutation,
    graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
