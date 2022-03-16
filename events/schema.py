
import graphene
from datetime import datetime, timedelta

from graphene_django import DjangoObjectType
# from graphql_jwt.decorators import login_required

from .models import Events
from users.models import CustomUser
from companies.models import Companies
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
    user_events_this_week = graphene.List(EventType, id=graphene.Int())
    user_events_next_week = graphene.List(EventType, id=graphene.Int())
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

    def resolve_user_events_this_week(root, info, id):
        now = datetime.now()
        monday = now - timedelta(days = now.weekday())
        next_monday = now + timedelta(days = 7 - now.weekday() )
        monday = monday.replace(hour=0, minute=0, second=0, microsecond=0)
        next_monday = next_monday.replace(hour=0, minute=0, second=0, microsecond=0)

        return Events.objects.filter(userFK=id, start__range=[monday, next_monday], end__range=[monday, next_monday])

    def resolve_user_events_next_week(root, info, id):
        now = datetime.now()
        next_monday = now + timedelta(days = 7 - now.weekday() )
        monday_after = now + timedelta(days = 14 - now.weekday())
        next_monday = next_monday.replace(hour=0, minute=0, second=0, microsecond=0)
        monday_after = monday_after.replace(hour=0, minute=0, second=0, microsecond=0)

        return Events.objects.filter(userFK=id, start__range=[next_monday, monday_after], end__range=[next_monday, monday_after])


class EventAddMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=False)
        allDay = graphene.Boolean(required=True)
        start = graphene.types.datetime.DateTime(required=True)
        end = graphene.types.datetime.DateTime(required=True)
        userFK = graphene.Int(required=True)
        companyFK = graphene.Int(required=False)


    event = graphene.Field(EventType)

    # @login_required
    def mutate(root, info, title, allDay, start, end, userFK, companyFK ):
        user_obj = CustomUser.objects.get(id=userFK)
        company_obj = Companies.objects.get(id=companyFK)
        event = Events(title=title, allDay=allDay, start=start, end=end, userFK=user_obj, companyFK=company_obj )


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
        userFK = graphene.Int(required=True)
        companyFK = graphene.Int(required=False)

    event = graphene.Field(EventType)

    # @login_required
    def mutate(root, info, id, title, allDay, start, end, userFK, companyFK):
        # Get single company from DB where PK = ID
        user_obj = CustomUser.objects.get(id=userFK)
        company_obj = Companies.objects.get(id=companyFK)
        event = Events.objects.get(pk=id)

        # Update event
        if title:
            event.title = title

        event.allDay = allDay
        event.start = start
        event.end = end
        event.userFK = user_obj
        event.companyFK = company_obj

        # Save to DB
        event.save()
        return EventUpdateMutation(event=event)


class Mutation(graphene.ObjectType):
    update_event = EventUpdateMutation.Field()
    add_event = EventAddMutation.Field()
    delete_event = EventDeleteMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)


