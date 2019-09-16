from . import models

from rest_framework import serializers


class DEAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.DEAccount
        fields = (
            'pk', 
            'DEusername', 
            'DEpassword', 
            'DEToken', 
            'DETokenDate', 
        )


