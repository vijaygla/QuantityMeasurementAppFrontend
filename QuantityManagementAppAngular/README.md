# Quantity Measurement App

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

