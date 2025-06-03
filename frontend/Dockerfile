FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Permitir que la variable llegue desde docker-compose
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Hacer el build de la app con la variable incluida
RUN npm run build

# Instalar un servidor estático para servir la app (serve)
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

