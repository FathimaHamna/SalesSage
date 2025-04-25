from django.urls import path
from . import views

urlpatterns = [
    # Existing authentication endpoints
    path('test/', views.test_connection, name='test-connection'),
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),

    # Existing sales data endpoints
    path('sales/', views.SalesDataViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='sales-list-create'),

    path('sales/<int:pk>/', views.SalesDataViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='sales-detail'),

    path('products/', views.ProductViewSet.as_view({
    'get': 'list',
    'post': 'create'
    }), name='product-list-create'),

    path('products/<int:pk>/', views.ProductViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='product-detail'),

    # Existing dashboard endpoints
    path('dashboard-stats/', views.get_dashboard_stats, name='dashboard-stats'),
    path('sales-trends/', views.get_sales_trends, name='sales-trends'),
    path('quick-insights/', views.get_quick_insights, name='quick-insights'),
    path('new-product-data/', views.get_products, name='new-product-data'),
    # New endpoint for sales analysis
    path('sales-data/', views.get_sales_data, name='sales-data'),
    path('profit-data/', views.get_profit_data, name='profit-data'),
    path('product-data/', views.get_sales_by_product, name='product-data'),
    path('customer-data/', views.get_sales_by_customer, name='customer-data'),
    path('get-top-customers/', views.get_top_customers, name='get-top-customers'),
    path('get-top-products/', views.get_top_products, name='get-top-products'),
    path('predict-monthly-sales/', views.predict_monthly_sales, name='predict-monthly-sales'),
    path('predict-weekly-sales/', views.predict_weekly_sales, name='predict-weekly-sales'),
    path('predict-daily-sales/', views.predict_daily_sales, name='predict-daily-sales'),
    path('daily-sales-prediction/', views.daily_sales_prediction, name='daily-sales-prediction'),
    path('predict-sales-in-range/', views.predict_sales_in_range, name='predict-sales-in-range'),
]
