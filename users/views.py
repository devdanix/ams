from django.http import HttpResponse
from django.shortcuts import render

from graphql_auth.mixins import VerifyAccountMixin

# Create your views here.
def activation(request, activation_token):
    return HttpResponse("You're looking at question %s." % activation_token )