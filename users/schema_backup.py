# import graphene
# from graphene_django import DjangoObjectType
# from django.contrib.auth import get_user_model

# class UserType(DjangoObjectType):
#     class Meta:
#         model = get_user_model()
#         fields = "__all__"
#         # fields = ('id', 'username')


# class Query(graphene.ObjectType):
#     single_user = graphene.Field(UserType, id=graphene.Int())

#     def resolve_single_user(root, info, id):
#         return get_user_model.objects.get(pk=id)


# class UserCreate(graphene.Mutation):
#     class Arguments:
#         username = graphene.String(required=True)
#         password = graphene.String(required=True)

#     user = graphene.Field(UserType)

#     def mutate(root, info, username, password):
#         user = get_user_model()(username=username)
#         user.set_password(password)
#         user.save()
#         return UserCreate(user=user)


# class Mutation(graphene.ObjectType):
#     create_user = UserCreate.Field()

# class Query(graphene.ObjectType):
#   pass

# class Mutation(graphene.ObjectType):
#   pass

# schema = graphene.Schema(query=Query, mutation=Mutation)

