from . import models
from . import serializers
from rest_framework import viewsets, permissions


class DEAccountViewSet(viewsets.ModelViewSet):
    """ViewSet for the DEAccount class"""

    queryset = models.DEAccount.objects.all()
    serializer_class = serializers.DEAccountSerializer
    permission_classes = [permissions.IsAuthenticated]


