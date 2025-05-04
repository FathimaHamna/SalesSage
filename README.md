# Salessage – Sales Prediction and Analysis System

Salessage is a smart web-based tool built specifically for a business to make sense of its sales data. It enables business owners to analyze historical sales trends, monitor current performance, and predict future sales with the help of machine learning models. The system empowers decision-making with an intuitive interface and interactive visualizations.

---

## 📌 Project Overview

Modern businesses are increasingly relying on data to guide their strategic decisions. Salessage bridges this gap by providing a powerful user-friendly platform for sales prediction and analysis.

The platform includes a dashboard with real-time and historical insights, a prediction interface powered by time series forecasting models, a data entry module to update sales records, and product management features. Built with a modern tech stack, it delivers both performance and usability.

---

## 📌 Key Objectives

- To help business owners visualize and analyze historical and real-time sales data.
- To forecast future sales using proven machine learning models (SARIMA and Prophet).
- To provide a modular platform where users can enter and manage sales and product information.
- To ensure secure access through user authentication.

---

## 📌 Features

### Predictive Analytics
- Forecast daily, weekly, and monthly sales using trained **SARIMA** and **Prophet** models.
- Use historical data patterns to improve business planning and inventory management.

### Sales Dashboard
- Get **Quick Insights**: Total sales, top customers, top products, and key trends.
- Visualize **real-time data** using dynamic charts.
- Explore **historical data** through interactive graphs and downloadable reports.

### Data Entry Module
- Manually input new sales data via a user-friendly form.
- Update and maintain a consistent data pipeline for analysis.

### Product Management
- Add and manage products with fields like Product ID, Category, Subcategory, Price, and Stock Level.
- View product performance, stock levels, and sales ranking.

### Authentication
- Secure user login and signup using Django’s authentication system.

---

## 📌 Tech Stack

### Backend
- **Django**: Python web framework for API development.
- **Django REST Framework (DRF)**: For building RESTful APIs.
- **PostgreSQL**: Relational database for storing structured sales data.
- **Machine Learning Libraries**: Pandas, Scikit-learn, Statsmodels, fbprophet, NumPy.

### Frontend
- **React.js**: For building dynamic and responsive UI.
- **Tailwind CSS**: For modern and mobile-friendly styling.
- **Chart.js / Recharts**: For rendering sales visualizations.

---

## 📌 Machine Learning Models

### 1. **SARIMA (Seasonal ARIMA)**
- Used for modeling time series data.
- Captures seasonality, trend, and noise components.
- Trained on historical sales for weekly and monthly predictions.

### 2. **Prophet**
- Developed by Facebook for business forecasting.
- Automatically handles missing data, outliers, and seasonal patterns.
- Trained on historical sales for daily predictions.

### Model Deployment
- Models are trained offline and saved as `.joblib` files.
- Backend loads models and returns predictions via API endpoints.

---

## 📌 Pages & Functionality

### Dashboard Page
- Quick key performance indicators (total sales, best product, best customer)
- Real-time charts (bar, line, pie)
- Historical sales analysis section

### Prediction Page
- Select prediction mode: Daily, Weekly, Monthly
- Enter custom dates
- View output predictions

### Data Entry Page
- Add sales transactions: Product, Quantity, Customer, Date, Price
- Data is saved to the backend and reflected in dashboards

### Products Page
- Add new products with category and stock details
- Filter and sort the product table by name, sales volume, etc.
- View metrics like top-selling and low-selling items
  
---

## 📌 Future Improvements

- Automated model retraining
- Email reports & alerts
- Inventory & stock-level integration


