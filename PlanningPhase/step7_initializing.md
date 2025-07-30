



npx create-next-app@latest webcraft --ts --tailwind

version: 15.4.2

remember to create a mongodb fetchy thingy
look at the dogTrading project for good mongoose code!
https://github.com/TheGamedev3/DogTrading/tree/main

- research nextjs 15.4.2 syntax in depth
- create the first route
- visit it
- visit the second route


npm install mongoose
npm install dotenv
npm install validator # for validating email strings

npm install --save-dev concurrently # for doing npm run dev, then triggering the start route in "src/launchserver.mjs"

npm install lucide-react # for some fancy icons

npm install bcryptjs # for password hashing

npx playwright install # E2E testing framework
npm i -D @playwright/test@latest
npx playwright test --init # creates the config file

npm i -D concurrently wait-on cross-env # for a special playwright command to start the server and tester concurrently

# to run all tests
npx playwright test