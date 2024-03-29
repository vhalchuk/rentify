# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## PlanetScale

Before you begin, make sure you have the following installed [the PlanetScale CLI](https://planetscale.com/cli).

To connect to your PlanetScale database using the CLI, you will need to run the following command:

```shell
pscale connect rentify dev --port 3309
```

Once you run this command, you will be prompted to enter your PlanetScale credentials. After entering your credentials, you will be connected to your database.

## Feature Sliced Design

This project is using the [Feature Sliced Design](https://feature-sliced.design/) architecture.
FSD was initially intended to organize front-end projects only. Despite being a full-stack application, this application shares the same principles with FSD of the one-way data flow.

## Integration Testing

To simulate a real-world environment Docker is used for instantiating the test database each time tests are run.

To run tests you will need Docker and Docker Compose installed on your machine.

To run integration tests run:

```shell
npm run test:integration
```
