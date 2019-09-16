from django.contrib import admin
from django import forms
from .models import DEAccount

class DEAccountAdminForm(forms.ModelForm):

    class Meta:
        model = DEAccount
        fields = '__all__'


class DEAccountAdmin(admin.ModelAdmin):
    form = DEAccountAdminForm
    list_display = [ 'DEToken', 'DETokenDate']
    readonly_fields = ['DEToken', 'DETokenDate']

admin.site.register(DEAccount, DEAccountAdmin)


