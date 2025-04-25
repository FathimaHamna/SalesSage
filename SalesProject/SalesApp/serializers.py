from rest_framework import serializers
from .models import NewSalesData
from .models import Product

class SalesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewSalesData
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
