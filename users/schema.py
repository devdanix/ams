
import graphene
from graphql import GraphQLError
import re

from graphql_auth.schema import UserQuery, MeQuery, UserNode
from graphql_auth import mutations
from graphql_auth.bases import Output
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload


class UserTypeLocal(DjangoObjectType):
    class Meta:
        model = get_user_model()
        fields = "__all__"
        # fields = ('id', 'username')

class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_set = mutations.PasswordSet.Field() # For passwordless registration
    password_change = mutations.PasswordChange.Field()
    update_account = mutations.UpdateAccount.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    send_secondary_email_activation =  mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()
    remove_secondary_email = mutations.RemoveSecondaryEmail.Field()

    # django-graphql-jwt inheritances
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()


class UserUpdateMutation(Output, graphene.Mutation):
    class Arguments:
        userID = graphene.Int()
        username = graphene.String(required=False)
        email = graphene.String(required=False)
        firstName = graphene.String(required=False)
        lastName = graphene.String(required=False)

    user = graphene.Field(UserNode)

    @classmethod
    def mutate(cls, root, info, **kwargs):

        errorsDic = dict()
        regex = '^[a-z0-9]+[\._]?[a-z0-9+]+[@]\w+[.]\w{2,3}$'
        user = get_user_model().objects.get(pk=kwargs.get('userID'))
        email = kwargs.get('email')
        username = kwargs.get('username')
        firstName = kwargs.get('firstName')
        lastName = kwargs.get('lastName')


        # Check email
        if(email != user.email):
            if not re.search(regex,email):
                errorsDic.update({"email":[{"message": ("Email not valid."), "code": "invalid_email"}]})
            if(get_user_model().objects.filter(email=email)):
                if errorsDic.get('email'):
                    errorsDic['email'] += [{"message": ("A user with that email already exists."), "code": "invalid_email"}]
                else:
                    errorsDic.update({"email":[{"message": ("A user with that email already exists."), "code": "invalid_email"}]})

        # Check username
        if(username != user.username):
            if(get_user_model().objects.filter(username=username)):
                errorsDic.update({"username":[{"message": ("A user with that username already exists."), "code": "invalid_username"}]})

        # Return Errors
        if(errorsDic):
            return cls(success=False, errors=errorsDic)

        if (user):
            if (username):
                user.username = username
            if (email):
                user.email = email
            if (firstName):
                user.first_name = firstName
            if (lastName):
                user.last_name = lastName
            # user.set_password(password)

            # Save to DB
            user.save()
        return UserUpdateMutation(user=user)


class UploadMutation(graphene.Mutation):
    class Arguments:
        userID = graphene.Int()
        file = Upload(required=True)

    success = graphene.Boolean()

    def mutate(self, info, file, userID, **kwargs):
        user = get_user_model().objects.get(pk=userID)

        if (user.image):
            user.image.storage.delete(user.image.name)

        user.image = file

        # Save to DB
        user.save()

        return UploadMutation(success=True)


class Query(UserQuery, MeQuery, graphene.ObjectType):
    single_user = graphene.Field(UserTypeLocal, id=graphene.Int())

    def resolve_single_user(root, info, id):
        return get_user_model().objects.get(pk=id)



class Mutation(AuthMutation, graphene.ObjectType):
    user_update = UserUpdateMutation.Field()
    upload_file = UploadMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)