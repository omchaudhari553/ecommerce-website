<div align="center">

# 🛒 E-Commerce Platform

### Full-Stack Shopping Application with AI-Powered Chatbot

A complete e-commerce solution featuring product management, shopping cart, order processing, payment integration (Razorpay), and an AI shopping assistant powered by OpenAI GPT.

<br/>

![Spring Boot](https://img.shields.io/badge/Spring_Boot-2.7-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-4-412991?style=for-the-badge&logo=openai&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-072654?style=for-the-badge&logo=razorpay&logoColor=white)

</div>

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 **Authentication** | JWT-based register / login with role-based access (Admin/User) |
| 👤 **User Management** | Profile management, order history, wishlist |
| 🛍️ **Product Catalog** | Browse products by category, search, filter by price/color |
| 🛒 **Shopping Cart** | Add/remove items, quantity management, real-time total |
| 💳 **Payment Integration** | Razorpay payment gateway integration |
| 📦 **Order Management** | Order placement, tracking, status updates |
| 🤖 **AI Shopping Assistant** | OpenAI GPT-powered chatbot for product recommendations |
| 📊 **Admin Dashboard** | Product management, order management, user management |
| 📧 **Email Notifications** | Order confirmation emails via JavaMail |

---

## 🛠 Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Framework | Spring Boot 2.7 · Java 17 |
| AI Integration | OpenAI Java SDK · GPT-4 |
| Security | Spring Security · JJWT · BCrypt |
| Persistence | Spring Data JPA · Hibernate · MySQL 8 |
| Payment | Razorpay SDK |
| Email | JavaMail API |
| Build | Maven 3.9 |

### Frontend

| Layer | Technology |
|---|---|
| Framework | Angular 19 (Standalone Components) |
| State Management | RxJS · Services |
| HTTP | Angular HttpClient |
| Styling | SCSS |
| Icons | FontAwesome |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java | 17+ |
| Maven | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8.0+ |
| OpenAI API Key | [Get one here](https://platform.openai.com/api-keys) |
| Razorpay Keys | [Get from Razorpay Dashboard](https://razorpay.com/) |

---

### 1 · Clone the repository

```bash
git clone <your-repo-url>
cd FinalProjectMain
```

---

### 2 · Database setup

```sql
CREATE DATABASE ecommerce_db;
```

Configure database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=your_password
```

---

### 3 · Backend setup

```bash
cd FinalProject

# Configure application.properties
# Set OPENAI_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

# Build and run
mvn clean package -DskipTests
mvn spring-boot:run
```

> API starts at **http://localhost:8080**

---

### 4 · Frontend setup

```bash
cd ecommerce-angular

# Install dependencies
npm install

# Start development server
ng serve
```

> Opens at **http://localhost:4200**

---

## 📁 Project Structure

```
FinalProjectMain/
├── FinalProject/                                    Spring Boot Backend
│   ├── src/main/
│   │   ├── resources/
│   │   │   ├── application.properties              Config (DB, OpenAI, Razorpay)
│   │   │   └── static/                             Angular build files
│   │   └── java/com/springboot/
│   │       ├── FinalProjectApplication.java
│   │       ├── config/
│   │       │   ├── SecurityConfig.java             JWT + CORS configuration
│   │       │   └── WebMvcConfig.java               Static file serving
│   │       ├── controller/
│   │       │   ├── AuthController.java
│   │       │   ├── ProductController.java
│   │       │   ├── CartController.java
│   │       │   ├── OrderController.java
│   │       │   ├── ChatbotController.java          AI chatbot endpoint
│   │       │   └── PaymentController.java
│   │       ├── dto/
│   │       │   ├── ChatbotRequest.java
│   │       │   ├── ChatbotResponse.java
│   │       │   └── ... (other DTOs)
│   │       ├── entity/
│   │       │   ├── User.java
│   │       │   ├── Product.java
│   │       │   ├── Cart.java
│   │       │   ├── Order.java
│   │       │   └── ...
│   │       ├── repository/
│   │       │   ├── UserRepository.java
│   │       │   ├── ProductRepository.java
│   │       │   └── ...
│   │       ├── security/
│   │       │   ├── JwtUtils.java
│   │       │   ├── JwtAuthFilter.java
│   │       │   └── ...
│   │       └── service/
│   │           ├── AuthService.java
│   │           ├── ChatbotService.java             OpenAI integration
│   │           ├── ProductService.java
│   │           └── ...
│   └── pom.xml
│
└── ecommerce-angular/                              Angular Frontend
    ├── src/app/
    │   ├── components/
    │   │   ├── auth/                              Login/Register
    │   │   ├── shop/                              Product listing
    │   │   ├── cart/                              Shopping cart
    │   │   ├── admin/                             Admin dashboard
    │   │   └── shared/
    │   │       ├── navbar/                        Navigation bar
    │   │       ├── footer/                        Footer component
    │   │       └── chatbot/                       AI chatbot UI
    │   ├── services/
    │   │   ├── auth.service.ts
    │   │   ├── chatbot.service.ts                  Chatbot API calls
    │   │   ├── product.service.ts
    │   │   └── ...
    │   ├── models/                                Data models
    │   ├── app.component.ts                       Root component
    │   └── app.module.ts                          Module configuration
    ├── angular.json
    └── package.json
```

---

## 🌐 API Reference

All endpoints except `/api/auth/**` require the header:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login → returns JWT token |

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `GET` | `/api/products/category/{category}` | Get products by category |
| `GET` | `/api/products/search/{name}` | Search products by name |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cart/add` | Add item to cart |
| `GET` | `/api/cart/{userId}` | Get user's cart |
| `DELETE` | `/api/cart/remove/{itemId}` | Remove item from cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders/user/{email}` | Get user's orders |
| `GET` | `/api/orders/{id}` | Get order by ID |

### AI Chatbot

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chatbot` | Send message to AI shopping assistant |

---

## 🤖 AI Shopping Assistant

The chatbot uses OpenAI GPT to provide:
- Product recommendations based on user preferences
- Size and color suggestions
- Outfit matching advice
- Price comparisons
- Stock availability information

**System Prompt:** Configured to provide concise, structured responses with max 3 product recommendations per query.

---

## 🚀 Deployment

### AWS Elastic Beanstalk

The application is deployed on AWS Elastic Beanstalk:
- **Backend:** Spring Boot JAR deployed to Elastic Beanstalk
- **Frontend:** Angular build served from Spring Boot static folder
- **Database:** AWS RDS MySQL
- **Production URL:** `https://shopping-platform.us-east-2.elasticbeanstalk.com`

### Build for Production

```bash
# Build Angular
cd ecommerce-angular
ng build

# Copy to Spring Boot static folder
cp -r dist/ecommerce-angular/browser/* ../FinalProject/src/main/resources/static/

# Build JAR
cd ../FinalProject
mvn clean package -DskipTests
```

---

## 📝 Environment Variables

Configure these in `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=your_password

# OpenAI
openai.api.key=your-openai-api-key

# Razorpay
razorpay.key.id=your-razorpay-key-id
razorpay.key.secret=your-razorpay-key-secret

# JWT
jwt.secret=your-jwt-secret-key
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Contributors

- [Your Name] - Full Stack Developer

---

## 🙏 Acknowledgments

- OpenAI for GPT API
- Razorpay for payment gateway
- Spring Boot team
- Angular team
