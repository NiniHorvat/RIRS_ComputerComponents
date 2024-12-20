# Faza 1: Gradnja backend aplikacije
FROM node:20 AS backend-build

WORKDIR /app/backend

# Kopiraj package datoteke in namesti odvisnosti za backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Kopiraj celoten backend
COPY backend ./

# Faza 2: Gradnja frontend aplikacije
FROM node:20 AS frontend-build

WORKDIR /frontend

# Kopiraj package datoteke za frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Kopiraj celoten frontend
COPY frontend ./

# Zgradi frontend (React aplikacijo)
RUN npm run build

# Faza 3: Strežba z Nginx (frontend) in Node.js (backend)
FROM nginx:alpine

# Kopiraj frontend build iz faze 2 v Nginx (statne datoteke)
COPY --from=frontend-build /frontend/build /usr/share/nginx/html

# Kopiraj backend aplikacijo v kontejner
COPY --from=backend-build /app/backend /app

# Odpiranje portov (frontend 80, backend 3000)
EXPOSE 80
EXPOSE 3000

# Zaženi backend (Node.js) in frontend (Nginx)
CMD ["sh", "-c", "cd /app && npm start & nginx -g 'daemon off;'"]
