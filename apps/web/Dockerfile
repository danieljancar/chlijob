FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source and scripts.
# Environment files (src/environments/) are committed without credentials
# and are populated at container start by set-env.js via SUPABASE_URL and
# SUPABASE_PUBLISHABLE_KEY environment variables.
COPY . .

EXPOSE 4200

# At runtime: set-env.js reads SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY env vars,
# writes environment.ts, then starts the Angular dev server on all interfaces.
CMD ["sh", "-c", "node scripts/set-env.js && npx ng serve --host 0.0.0.0 --port 4200"]
