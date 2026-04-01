# 📏 Quantity Measurement System

A full-stack application designed to perform **measurement comparison, conversion, and arithmetic operations** across different domains like Length, Weight, Temperature, and Volume.

This project demonstrates strong concepts of **software design, frontend development, backend architecture, and system integration**.

---

## 🚀 Project Overview

The Quantity Measurement System allows users to:

* Compare two quantities
* Convert units from one form to another
* Perform arithmetic operations on quantities

It supports multiple measurement types:

* Length
* Weight
* Temperature
* Volume

---

## 🧩 Use Cases Covered (UC1 – UC19)

### ✅ Core Backend Use Cases

* UC1 – Add Length Units

* UC2 – Compare Length Units

* UC3 – Convert Length Units

* UC4 – Arithmetic Operations (Length)

* UC5 – Add Weight Units

* UC6 – Compare Weight Units

* UC7 – Convert Weight Units

* UC8 – Arithmetic Operations (Weight)

* UC9 – Temperature Conversion

* UC10 – Temperature Comparison

* UC11 – Volume Conversion

* UC12 – Volume Comparison

---

### 🏗️ Architecture & System Use Cases

* UC13 – Layered Architecture Implementation
* UC14 – Dependency Injection
* UC15 – Repository Pattern
* UC16 – Service Layer Abstraction
* UC17 – Database Integration (Entity Framework)
* UC18 – Authentication (Register/Login System)

---

### 🌐 Frontend Use Case

* UC19 – HTML, CSS, JavaScript & AJAX Frontend

  * Dynamic UI rendering
  * DOM manipulation
  * Event handling
  * Responsive design
  * API integration (AJAX/Fetch)

---

## 🏗️ Architecture

The project follows a **clean layered architecture**:

```
Presentation Layer (Frontend / UI)
        ↓
Controller Layer (API)
        ↓
Service Layer (Business Logic)
        ↓
Repository Layer (Data Access)
        ↓
Database (SQL Server)
```

---

## 🧠 Design Patterns Used

* Repository Pattern
* Dependency Injection (DI)
* Service Pattern
* MVC Architecture
* Separation of Concerns

---

## 🛠️ Technologies Used

### 🔹 Frontend

* HTML5
* CSS3 (Flexbox, Grid, Responsive UI)
* JavaScript (ES6+)
* DOM Manipulation
* AJAX / Fetch API

### 🔹 Backend

* C# (.NET Core / .NET Web API)
* Entity Framework Core
* LINQ

### 🔹 Database

* SQL Server

---

## 🎨 Frontend Features

* Modern responsive UI
* Card-based layout
* Dynamic unit selection
* Real-time calculations
* Error handling
* Clean user experience

---

## ⚙️ Key Functionalities

* Unit Comparison
* Unit Conversion
* Arithmetic Calculations
* Multi-unit support
* Scalable architecture
* Backend integration ready

---

## 🔐 Authentication (UC18)

* User Registration
* User Login
* Secure access to features

---

## 🔄 API Integration (AJAX)

Frontend communicates with backend using:

* Fetch API
* Async/Await
* JSON data handling

---

## 📂 Folder Structure

```
quantity-measurement-system/

├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   └── Data/
│
└── README.md
```

---

## ▶️ How to Run

### 🔹 Frontend

1. Open `index.html` in browser
2. Or use Live Server (VS Code)

### 🔹 Backend

1. Open project in Visual Studio
2. Configure database connection
3. Run migrations
4. Start API

---

## 📌 Future Enhancements

* Add more measurement types
* Mobile app version
* Advanced UI animations
* Real-time API integration
* Unit history tracking

---

# Quantity Measurement App using Angular

A modern, responsive Angular application for converting, comparing, and performing arithmetic on various physical quantities.

## 🚀 Features

- **Unit Conversion**: Seamlessly convert between units within the same category (Length, Weight, Volume, Temperature).
- **Unit Comparison**: Compare two quantities with different units (e.g., 1000m vs 1km) and get a `True/False` result.
- **Arithmetic Operations**: Perform Addition, Subtraction, Multiplication, and Division on quantities. The app automatically handles unit alignment.
- **Responsive UI**: A sleek, rectangular-grid design that works beautifully on mobile and desktop.

## 🛠️ Technology Stack

- **Angular 21**: Leveraging the latest standalone components and functional patterns for a lightweight, performant application.
- **SCSS**: Custom, modular styling with a focus on modern aesthetics (gradients, transitions, and flexible grids).
- **TypeScript**: Ensuring type safety and robust logic throughout the conversion services.
- **Material Icons**: Clear, intuitive iconography for better user experience.

## 🧪 Solution & Logic

### Conversion Engine
The core logic resides in the `Quantity` service, which uses centralized mapping for each category:
- **Base Unit Strategy**: All units (except temperature) are mapped to a base unit (e.g., meters for length). Conversion is done by multiplying by the source factor and dividing by the target factor.
- **Temperature Logic**: Since temperature is non-linear, it uses specific formulas to convert everything to Celsius first, then to the target unit.

### Smart Comparison
The comparison logic converts the first value into the target unit of the second value before checking for equality. This ensures that `1000 Meters == 1 Kilometer` returns `True`.

### Dynamic UI
The dashboard dynamically updates the available units and calculation modes based on user selection, providing a seamless and error-free interaction flow.

## 📈 Use Cases

1.  **Engineering**: Quick conversion between metric units (e.g., mm to km).
2.  **Cooking/Lab**: Converting volumes (ml to l) or weights (mg to kg).
3.  **Global Travel**: Comparing temperatures between Celsius and Fahrenheit.
4.  **Math/Education**: Understanding relationships between different units of measurement through arithmetic.

## 🏗️ Development

### Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests
Run `npm test` to execute the unit tests via Vitest.

### Start Development Server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`.

