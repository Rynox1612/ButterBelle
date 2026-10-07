# ButterBelle frontend

A React frontend for the product and customer APIs in the ButterBell Spring Boot application.

## Run locally

Start the backend from the repository root:

```bash
./mvnw spring-boot:run
```

In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies requests beginning with `/api` to the backend at `http://localhost:8080`, so no local CORS changes are required.

To use a different backend URL, create a `.env.local` file:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

## Available screens

- Product list, search, create, edit, and delete
- Customer list, search, create, edit, and delete
- Loading, empty, validation, API error, and delete-confirmation states

## Checks

```bash
npm run lint
npm run build
```
