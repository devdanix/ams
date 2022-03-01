import graphene

from graphene_django import DjangoObjectType, DjangoListField
from graphql_jwt.decorators import login_required

from .models import Companies


class CompanyType(DjangoObjectType):
    class Meta:
        model = Companies
        fields = ("id", "name", 'website', 'telephone')


class Query(graphene.ObjectType):
    single_company = graphene.Field(CompanyType, id=graphene.Int())
    all_companies = graphene.List(CompanyType)

    # @login_required
    def resolve_single_company(root, info, id):
        return Companies.objects.get(pk=id)

    # @login_required
    def resolve_all_companies(root, info):
        return Companies.objects.all()


class CompanyAddMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        website = graphene.String()
        telephone = graphene.Int()

    company = graphene.Field(CompanyType)

    @login_required
    def mutate(root, info, name, website, telephone ):
        company = Companies(name=name, website=website, telephone=telephone)

        # Save to DB
        company.save()
        return CompanyAddMutation(company=company)


class CompanyDeleteMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    company = graphene.Field(CompanyType)

    # @login_required
    def mutate(root, info, id):
        # Create new category object with name from parameters
        company = Companies.objects.get(pk=id)

        if company is not None:
            company.delete()

        return


class CompanyUpdateMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        name = graphene.String(required=True)

    company = graphene.Field(CompanyType)

    # @login_required
    def mutate(root, info, id, name):
        # Get single company from DB where PK = ID
        company = Companies.objects.get(pk=id)

        # Update companu name with name from parameters
        company.name = name

        # Save to DB
        company.save()
        return CompanyUpdateMutation(company=company)

class Mutation(graphene.ObjectType):
    add_company = CompanyAddMutation.Field()
    delete_company = CompanyDeleteMutation.Field()
    update_company = CompanyUpdateMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)


