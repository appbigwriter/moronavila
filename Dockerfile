# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código e gerar build do frontend
COPY . .
ARG VITE_SUPABASE_URL=https://supabase-control-tower-api.fbr.news
ARG VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5OTkwODc2LCJleHAiOjE5NDc2NzA4NzZ9.f2enmw8Mk0hWI6WcNfkZLGOl-qaqVzQBGt8qftDaR6k
ARG VITE_SUPABASE_SCHEMA=custom_moronavila
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_SCHEMA=$VITE_SUPABASE_SCHEMA
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copiar apenas o necessário do estágio de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/mac-server.ts ./mac-server.ts

# Expor portas 3000 (padrão do contrato Easypanel) e 4000
EXPOSE 3000
EXPOSE 4000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Executar o servidor usando tsx
CMD ["npm", "run", "mac-app"]
