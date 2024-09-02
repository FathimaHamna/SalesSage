from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets, status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
import os
from django.utils.timezone import now, timedelta
from django.http import JsonResponse
import pandas as pd
import matplotlib.pyplot as plt
from django.conf import settings
from .models import NewSalesData
from .serializers import SalesDataSerializer
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncWeek
from datetime import datetime, timedelta
import joblib 
import pandas as pd
import json
import traceback
from sklearn.preprocessing import StandardScaler
import numpy as np
from .models import Product
from .serializers import ProductSerializer

# Add this function for root URL
def index(request):
    """
    Render the main index page
    """
    return render(request, 'api/index.html')  # Make sure this template exists

class SalesDataViewSet(viewsets.ModelViewSet):
    queryset = NewSalesData.objects.all()
    serializer_class = SalesDataSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
   
@api_view(['GET'])
def test_connection(request):
    """
    Test the backend connection and return status
    """
    try:
        # Simple test - check if we can access the database
        User.objects.first()
        
        return Response({
            'message': 'Backend is connected successfully!',
            'status': 'ok',
            'timestamp': timezone.now().isoformat()
        })
            
    except Exception as e:
        return Response({
            'message': 'Backend connection failed!',
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def api_root(request):
    """
    API root endpoint showing available endpoints
    """
    return Response({
        'message': 'Welcome to Sales API',
        'endpoints': {
            'root': '/api/',
            'test_connection': '/api/test/',
        },
        'status': 'ok',
        'timestamp': timezone.now().isoformat()
    })

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'token': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        email = request.data['email']
        password = request.data['password']
        
        user = User.objects.get(email=email)
        if not user.check_password(password):
            raise Exception('Invalid credentials')
            
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'token': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def get_dashboard_stats(request):
    """Get aggregated statistics for dashboard"""
    total_sales = NewSalesData.objects.aggregate(total=Sum('sales'))
    total_profit = NewSalesData.objects.aggregate(total=Sum('profit'))
    
    # Get top products
    top_products = NewSalesData.objects.values('product_name')\
        .annotate(total_sales=Sum('sales'))\
        .order_by('-total_sales')[:5]
    
    # Get top customers
    top_customers = NewSalesData.objects.values('customer_name')\
        .annotate(total_purchases=Sum('sales'))\
        .order_by('-total_purchases')[:5]
    
    return Response({
        'total_sales': total_sales['total'],
        'total_profit': total_profit['total'],
        'top_products': list(top_products),
        'top_customers': list(top_customers)
    })

@api_view(['GET'])
def get_sales_trends(request):
    """Get sales trends by month and week"""
    monthly_trends = NewSalesData.objects.annotate(
        month=TruncMonth('order_date')
    ).values('month').annotate(
        total_sales=Sum('sales')
    ).order_by('month')

    weekly_trends = NewSalesData.objects.annotate(
        week=TruncWeek('order_date')
    ).values('week').annotate(
        total_sales=Sum('sales')
    ).order_by('week')

    return Response({
        'monthly_trends': list(monthly_trends),
        'weekly_trends': list(weekly_trends)
    })

@api_view(['GET'])
def get_quick_insights(request):
    try:
        # Get yesterday's date
        yesterday = timezone.now().date() - timedelta(days=1)
        yesterday_start = timezone.make_aware(timezone.datetime.combine(yesterday, timezone.datetime.min.time()))
        yesterday_end = timezone.make_aware(timezone.datetime.combine(yesterday, timezone.datetime.max.time()))

        # Get yesterday's data
        yesterday_data = NewSalesData.objects.filter(
            order_date__range=(yesterday_start, yesterday_end)
        )

        # Calculate metrics
        total_sales = yesterday_data.aggregate(Sum('sales'))['sales__sum'] or 0
        total_orders = yesterday_data.count()
        total_profit = yesterday_data.aggregate(Sum('profit'))['profit__sum'] or 0
        avg_order_value = total_sales / total_orders if total_orders > 0 else 0

        return Response({
            'status': 'success',
            'data': {
                'date': yesterday.strftime('%Y-%m-%d'),
                'total_sales': float(total_sales),
                'total_orders': total_orders,
                'avg_order_value': float(avg_order_value),
                'total_profit': float(total_profit)
            }
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
@api_view(['GET'])
def get_sales_data(request):
    """Fetch aggregated order_date and total sales for sales analysis."""
    try:
        thirty_days_ago = datetime.now() - timedelta(days=30)
        sales_data = (
            NewSalesData.objects
            .filter(order_date__gte=thirty_days_ago)
            .values('order_date')
            .annotate(total_sales=Sum('sales'))
            .order_by('order_date')
        )
        sales_data_list = [
            {'order_date': item['order_date'].strftime('%Y-%m-%d'), 'sales': item['total_sales']}
            for item in sales_data
        ]
        
        return Response({
            'status': 'success',
            'sales': sales_data_list
        })

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)


@api_view(['GET'])
def get_profit_data(request):
    """Fetch order_date and total profit for sales analysis"""
    try:
        thirty_days_ago = datetime.now() - timedelta(days=30)
        profit_data = (
            NewSalesData.objects
            .filter(order_date__gte=thirty_days_ago)
            .values('order_date')
            .annotate(total_profit=Sum('profit'))
            .order_by('order_date')
        )
        profit_data_list = [
            {'order_date': item['order_date'].strftime('%Y-%m-%d'), 'profit': item['total_profit']}
            for item in profit_data
        ]
        
        return Response({
            'status': 'success',
            'sales': profit_data_list
        })

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

@api_view(['GET'])
def get_sales_by_product(request):
    """Fetch product_name and total sales for sales by product analysis"""
    try:
        sales_by_product = (
            NewSalesData.objects
            .values('product_name')
            .annotate(total_sales=Sum('sales'))
            .order_by('product_name')
        )
        sales_by_product_list = [
            {'product_name': item['product_name'], 'sales': item['total_sales']}
            for item in sales_by_product
        ]
        
        return Response({
            'status': 'success',
            'sales': sales_by_product_list
        })

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

@api_view(['GET'])
def get_sales_by_customer(request):
    """Fetch sales data aggregated by customer"""
    try:
        # Aggregate sales by customer using Django ORM's annotate and aggregation
        sales_by_customer_data = NewSalesData.objects.values('customer_name').annotate(total_sales=Sum('sales'))
        sales_by_customer_data_list = list(sales_by_customer_data)
        
        return Response({
            'status': 'success',
            'sales': sales_by_customer_data_list
        })

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

@api_view(['GET'])
def get_top_customers(request):
    """Fetch top customers sorted by total sales in descending order"""
    try:
        top_customers = (
            NewSalesData.objects
            .values('customer_name')
            .annotate(total_sales=Sum('sales'))
            .order_by('-total_sales')  # Descending order
        )

        customer_data = [
            {'customer_name': item['customer_name'], 'total_sales': float(item['total_sales'])}
            for item in top_customers
        ]

        return Response({
            'status': 'success',
            'sales': customer_data
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
@api_view(['GET'])
def get_top_products(request):
    """Fetch top customers sorted by total sales in descending order"""
    try:
        top_customers = (
            NewSalesData.objects
            .values('product_name')
            .annotate(total_sales=Sum('sales'))
            .order_by('-total_sales')  # Descending order
        )

        product_data = [
            {'product_name': item['product_name'], 'total_sales': float(item['total_sales'])}
            for item in top_customers
        ]

        return Response({
            'status': 'success',
            'sales': product_data
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
# Load the SARIMA model safely
model_path = 'SalesApp/saved_models/sarima_monthly_sales_model.joblib'
try:
    sarima_model = joblib.load(model_path)  # Renamed from `model` to `sarima_model`
    print("SARIMA Monthly Sales model loaded successfully")
except Exception as e:
    print(f"Error loading SARIMA Monthly Sales model: {e}")
    sarima_model = None  # Prevent further errors

@api_view(['POST'])
def predict_monthly_sales(request):
    """Predict monthly sales using the SARIMA model"""
    try:
        data = request.data  # DRF automatically parses JSON
        date = data.get("date")

        if not date:
            return Response({"status": "error", "message": "No date provided"}, status=status.HTTP_400_BAD_REQUEST)

        if sarima_model is None:
            return Response({"status": "error", "message": "SARIMA model not loaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Convert input date
        date = pd.to_datetime(date)

        # Check if the model has a data attribute
        if hasattr(sarima_model, "model") and hasattr(sarima_model.model, "data"):
            last_train_date = sarima_model.model.data.dates[-1]
        else:
            return Response({"status": "error", "message": "SARIMA model missing training data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Ensure date is in the future
        if date <= last_train_date:
            return Response({"status": "error", "message": "Date must be in the future"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate forecast steps (months ahead)
        forecast_steps = (date.year - last_train_date.year) * 12 + (date.month - last_train_date.month)
        if forecast_steps <= 0:
            return Response({"status": "error", "message": "Invalid forecast steps"}, status=status.HTTP_400_BAD_REQUEST)

        # Get forecast
        forecast = sarima_model.get_forecast(steps=forecast_steps)
        predicted_sales = forecast.predicted_mean.iloc[-1]

        return Response({
            "status": "success",
            "date": date.strftime('%Y-%m-%d'),
            "predicted_sales": round(predicted_sales, 2)
        })
    except Exception as e:
        print("Error in prediction:", traceback.format_exc())  # Print full error traceback
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# Load the SARIMA model safely
w_model_path = 'SalesApp/saved_models/weekly_sales_model.joblib'
try:
    w_sarima_model = joblib.load(w_model_path)  # Renamed from `model` to `sarima_model`
    print("SARIMA Weekly Sales model loaded successfully")
except Exception as e:
    print(f"Error loading SARIMA Weekly Sales model: {e}")
    w_sarima_model = None  # Prevent further errors

@api_view(['POST'])
def predict_weekly_sales(request):
    """Predict weekly sales using the SARIMA model"""
    try:
        data = request.data  # DRF automatically parses JSON
        date = data.get("date")

        if not date:
            return Response({"status": "error", "message": "No date provided"}, status=status.HTTP_400_BAD_REQUEST)

        if w_sarima_model is None:
            return Response({"status": "error", "message": "SARIMA model not loaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Convert input date
        date = pd.to_datetime(date)

        # Check if the model has a data attribute
        if hasattr(w_sarima_model, "model") and hasattr(w_sarima_model.model, "data"):
            last_train_date = w_sarima_model.model.data.dates[-1]
        else:
            return Response({"status": "error", "message": "SARIMA model missing training data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Ensure date is in the future
        if date <= last_train_date:
            return Response({"status": "error", "message": "Date must be in the future"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate forecast steps (months ahead)
        forecast_steps = (date.year - last_train_date.year) * 12 + (date.month - last_train_date.month)
        if forecast_steps <= 0:
            return Response({"status": "error", "message": "Invalid forecast steps"}, status=status.HTTP_400_BAD_REQUEST)

        # Get forecast
        forecast = w_sarima_model.get_forecast(steps=forecast_steps)
        predicted_sales = forecast.predicted_mean.iloc[-1]

        return Response({
            "status": "success",
            "date": date.strftime('%Y-%m-%d'),
            "predicted_sales": round(predicted_sales, 2)
        })
    except Exception as e:
        print("Error in prediction:", traceback.format_exc())  # Print full error traceback
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
# Load the Prophet model
d_model_path = 'SalesApp/saved_models/daily_sales_model.joblib'
try:
    d_model = joblib.load(d_model_path)
    print("Prophet Daily Sales model loaded successfully")
except Exception as e:
    print(f"Error loading Prophet Daily Sales model: {e}")

@api_view(['POST'])
def predict_daily_sales(request):
    """Predict daily sales using the Prophet model"""
    try:
        data = request.data  # DRF automatically parses JSON
        date = data.get("date")

        if not date:
            return Response({"status": "error", "message": "No date provided"}, status=status.HTTP_400_BAD_REQUEST)

        if d_model is None:
            return Response({"status": "error", "message": "Prophet model not loaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Convert input date
        date = pd.to_datetime(date)

        # Ensure date is in the future
        last_train_date = d_model.history['ds'].max()
        if date <= last_train_date:
            return Response({"status": "error", "message": "Date must be in the future"}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare future DataFrame
        future = pd.DataFrame({"ds": [date]})

        # Get forecast
        forecast = d_model.predict(future)
        predicted_sales = forecast['yhat'].iloc[0]

        return Response({
            "status": "success",
            "date": date.strftime('%Y-%m-%d'),
            "predicted_sales": round(predicted_sales, 2)
        })
    except Exception as e:
        print("Error in prediction:", traceback.format_exc())  # Print full error traceback
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from datetime import timedelta

@api_view(['POST'])
def predict_sales_in_range(request):
    """Predict sales for each date in a specified range using the SARIMA model"""
    try:
        data = request.data  # DRF automatically parses JSON
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not start_date or not end_date:
            return Response({"status": "error", "message": "Both start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        if w_sarima_model is None:
            return Response({"status": "error", "message": "SARIMA model not loaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Convert the input dates to pandas datetime format
        start_date = pd.to_datetime(start_date)
        end_date = pd.to_datetime(end_date)

        # Ensure the end date is after the start date
        if end_date <= start_date:
            return Response({"status": "error", "message": "End date must be after start date"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the model has training data
        if hasattr(w_sarima_model, "model") and hasattr(w_sarima_model.model, "data"):
            last_train_date = w_sarima_model.model.data.dates[-1]
        else:
            return Response({"status": "error", "message": "SARIMA model missing training data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Ensure the start date is after the last training date
        if start_date <= last_train_date:
            return Response({"status": "error", "message": "Start date must be after the last training date"}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare to generate predictions for each week in the date range
        date_range = pd.date_range(start=start_date, end=end_date, freq='W-MON')  # Weekly predictions (can adjust the frequency as needed)

        predictions = []
        for date in date_range:
            # Calculate forecast steps (weeks/months ahead)
            forecast_steps = (date.year - last_train_date.year) * 12 + (date.month - last_train_date.month)
            if forecast_steps <= 0:
                continue

            # Get forecast
            forecast = w_sarima_model.get_forecast(steps=forecast_steps)
            predicted_sales = forecast.predicted_mean.iloc[-1]

            # Add the prediction to the list
            predictions.append({
                "date": date.strftime('%Y-%m-%d'),
                "predicted_sales": round(predicted_sales, 2)
            })

        if not predictions:
            return Response({"status": "error", "message": "No predictions could be generated."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "status": "success",
            "predictions": predictions
        })

    except Exception as e:
        print("Error in prediction:", traceback.format_exc())  # Log error
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Load the saved model
MODEL_PATH = os.path.join("SalesApp", "saved_models", "daily_sales_model.joblib")
model = joblib.load(MODEL_PATH)

@api_view(["GET"])
def daily_sales_prediction(request):
    selected_date = request.GET.get("date")
    
    if not selected_date:
        return JsonResponse({"error": "No date provided"}, status=400)

    try:
        # Convert selected date to datetime object
        end_date = datetime.strptime(selected_date, "%Y-%m-%d")
        start_date = end_date - timedelta(days=30)  # One month before

        # Generate date range
        date_range = pd.date_range(start=start_date, end=end_date)

        # Prepare dataframe for prediction
        df = pd.DataFrame({"ds": date_range})  # Prophet uses 'ds' column for dates

        # Make predictions
        forecast = model.predict(df)

        # Extract relevant predictions
        sales_data = [
            {"date": str(row["ds"].date()), "predicted_sales": round(row["yhat"], 2)}
            for _, row in forecast.iterrows()
        ]

        return JsonResponse({"sales_data": sales_data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    