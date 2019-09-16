from django.urls import reverse
from django_extensions.db.fields import AutoSlugField
from django.db.models import DateTimeField
from django.db.models import TextField
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.contrib.auth import models as auth_models
from django.db import models as models
from django_extensions.db import fields as extension_fields


class DEAccount(models.Model):

    # Fields
    DEToken = models.TextField(max_length=100, blank=True)
    DETokenDate = models.DateTimeField(null=True, blank=True)

    # Relationship Fields
    djangouser = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, related_name="deaccounts", 
    )

    class Meta:
        ordering = ('-pk',)

    def __unicode__(self):
        return u'%s' % self.pk

    def get_absolute_url(self):
        return reverse('app_deaccount_detail', args=(self.pk,))


    def get_update_url(self):
        return reverse('app_deaccount_update', args=(self.pk,))


