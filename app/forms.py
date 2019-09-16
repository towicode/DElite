from django import forms
from .models import DEAccount


class DEAccountForm(forms.ModelForm):
    class Meta:
        model = DEAccount
        fields = ['DEToken', 'DETokenDate', 'djangouser']


