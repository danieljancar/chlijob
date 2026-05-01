FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source and scripts.
# Environment files (src/environments/) are committed without credentials.
# At container start, a .env.local is generated from SUPABASE_URL and
# SUPABASE_PUBLISHABLE_KEY environment variables for set-env.js to consume.
COPY . .

EXPOSE 4200

# At runtime: write a .env.local from the SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY
# environment variables, then let set-env.js generate environment.ts and start
# the Angular dev server on all interfaces.
CMD ["sh", "-c", "printf 'SUPABASE_URL=%s\\nSUPABASE_PUBLISHABLE_KEY=%s\\n' \"$SUPABASE_URL\" \"$SUPABASE_PUBLISHABLE_KEY\" > .env.local && node scripts/set-env.js && npx ng serve --host 0.0.0.0 --port 4200"]
