# Mocknroll Backend API

Backend service for an online food delivery app, designed to integrate with your existing frontend UI.

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from example:

```bash
copy .env.example .env
```

3. Update `.env` values (especially `MONGODB_URI` and `JWT_SECRET`).

4. Run in development:

```bash
npm run dev
```

## API base URL

`http://localhost:5000/api`

## Endpoints

### Health
- `GET /health`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (Bearer token)

### Restaurants
- `GET /restaurants`
- `GET /restaurants?search=pizza&cuisine=Indian&sortBy=rating_desc`
- `GET /restaurants/filters`
- `POST /restaurants`

### Menu
- `GET /menu/restaurant/:restaurantId`
- `GET /menu/restaurant/:restaurantId?preference=vegetarian&category=burgers&search=spicy&sortBy=popular`
- `GET /menu/preference/:preference?restaurantId=RESTAURANT_ID&category=curries`
- `GET /menu/filters?restaurantId=RESTAURANT_ID&preference=vegetarian`
- `POST /menu`

### Orders
- `POST /orders` (Bearer token)
- `GET /orders/my` (Bearer token)

## Sample register payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "customer"
}
```

## Sample order payload

```json
{
  "restaurant": "RESTAURANT_ID",
  "deliveryAddress": "221B Baker Street",
  "paymentMethod": "cod",
  "items": [
    {
      "menuItem": "MENU_ITEM_ID",
      "quantity": 2
    }
  ]
}
```

## UI integration mapping (from your screenshots)

- Home / Landing page
  - Fetch restaurants: `GET /restaurants`
  - Search restaurants: `GET /restaurants?search=<text>`
  - Cuisine chips: `GET /restaurants/filters`

- Choose Preference page
  - Vegetarian tab: `GET /menu/preference/vegetarian`
  - Non-veg tab: `GET /menu/preference/non_vegetarian`
  - Eggetarian tab: `GET /menu/preference/eggetarian`

- Expanded menu page with left filters/chips
  - Fetch categories/filter data: `GET /menu/filters?restaurantId=<id>&preference=<type>`
  - Fetch menu grid:
    - `GET /menu/restaurant/<id>?preference=<type>&category=<cat>&search=<text>&sortBy=popular`

- Cart / Checkout
  - Place order: `POST /orders` with Bearer token
  - Fetch order history: `GET /orders/my`

## Sample menu item payload

```json
{
  "restaurant": "RESTAURANT_ID",
  "name": "Paneer Tikka Burger",
  "description": "Burger with paneer tikka patty",
  "price": 9.99,
  "preference": "vegetarian",
  "category": "burgers",
  "tags": ["spicy", "chef-special"],
  "imageUrl": "https://example.com/paneer-burger.jpg",
  "rating": 4.6,
  "prepTimeMinutes": 18,
  "isPopular": true,
  "isAvailable": true
}
```
