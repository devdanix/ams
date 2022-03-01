
import graphene

from graphene_django import DjangoObjectType
# from graphql_jwt.decorators import login_required

from .models import Events
from users.models import CustomUser
from django.contrib.auth import get_user_model

class UserType(DjangoObjectType):
    class Meta:
        # model = CustomUser
        model = get_user_model()
        fields = "__all__"


class EventType(DjangoObjectType):
    class Meta:
        model = Events
        fields = "__all__"


class Query(graphene.ObjectType):
    single_event = graphene.Field(EventType, id=graphene.Int())
    user_events = graphene.List(EventType, id=graphene.Int())
    all_events = graphene.List(EventType)

    # @login_required
    def resolve_single_event(root, info, id):
        return Events.objects.get(pk=id)

    # @login_required
    def resolve_all_events(root, info):
        return Events.objects.all()

    # @login_required
    def resolve_user_events(root, info, id):
        return Events.objects.filter(userFK=id)


class EventAddMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=False)
        allDay = graphene.Boolean(required=True)
        start = graphene.types.datetime.DateTime(required=True)
        end = graphene.types.datetime.DateTime(required=True)
        userFK = graphene.Int(required=True)


    event = graphene.Field(EventType)

    # @login_required
    def mutate(root, info, title, allDay, start, end, userFK ):
        user_obj = CustomUser.objects.get(id=userFK)
        event = Events(title=title, allDay=allDay, start=start, end=end, userFK=user_obj)


        event.save()
        return EventAddMutation(event=event)


class EventDeleteMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    event =  graphene.Field(EventType)

    # @login_required
    def mutate(root, info, id):
        # Create new category object with name from parameters
        event = Events.objects.get(pk=id)

        if event is not None:
            event.delete()

        return


class EventUpdateMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        title = graphene.String(required=False)
        allDay = graphene.Boolean(required=True)
        start = graphene.types.datetime.DateTime(required=True)
        end = graphene.types.datetime.DateTime(required=True)

    event = graphene.Field(EventType)

    # @login_required
    def mutate(root, info, id, title, allDay, start, end):
        # Get single company from DB where PK = ID
        event = Events.objects.get(pk=id)

        # Update event
        if title:
            event.title = title

        event.allDay = allDay
        event.start = start
        event.end = end

        # Save to DB
        event.save()
        return EventUpdateMutation(event=event)


class Mutation(graphene.ObjectType):
    update_event = EventUpdateMutation.Field()
    add_event = EventAddMutation.Field()
    delete_event = EventDeleteMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)


