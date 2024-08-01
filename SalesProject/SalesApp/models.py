from django.db import models

class NewSalesData(models.Model):
    order_date = models.DateField()
    customer_id = models.CharField(max_length=20)
    customer_name = models.CharField(max_length=100)
    segment = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    region = models.CharField(max_length=50)
    product_id = models.CharField(max_length=20)
    category = models.CharField(max_length=50)
    sub_category = models.CharField(max_length=50)
    product_name = models.CharField(max_length=200)
    sales = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    discount = models.DecimalField(max_digits=4, decimal_places=2)
    profit = models.DecimalField(max_digits=10, decimal_places=2)
    avg_for_week = models.DecimalField(max_digits=10, decimal_places=4)
    avg_for_month = models.DecimalField(max_digits=10, decimal_places=4)
    week_sales = models.DecimalField(max_digits=10, decimal_places=4)
    month_sales = models.DecimalField(max_digits=10, decimal_places=4)
    day_sales = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return f"{self.order_date} - {self.customer_name} - {self.product_name}"

    class Meta:
        db_table = 'new_sales_data'
        ordering = ['-order_date']
        managed = True


class Product(models.Model):
    product_id = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    sub_category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_level = models.IntegerField()

    def __str__(self):
        return self.product_name
    
    class Meta:
        db_table = 'products'  # This ensures the table is named 'products' in PostgreSQL
        managed = True  # Django will manage this table
