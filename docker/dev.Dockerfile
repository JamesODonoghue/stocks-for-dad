FROM node:slim

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app/next-app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

# RUN npx prisma migrate dev --name init

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# for deploting the build version

# RUN bun next build
# and
# RUN bun next start

# OR for sart Next.js in development, comment above two lines and uncomment below line
# COPY --from=build /app/migrate-and-start.sh .

COPY migrate-and-start.sh .
RUN chmod +x migrate-and-start.sh
CMD ["./migrate-and-start.sh"]
# CMD source migrate-and-start.sh

# Note: Don't expose ports here, Compose will handle that for us