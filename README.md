This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Authentication

Firebase and Google authentication are not used. Admin login is an internal, server-side password flow for these three allowlisted accounts only:

- `podcraftindia@gmail.com`
- `omkarshirvalkar@gmail.com`
- `swayamuk1@gmail.com`

1. Copy `.env.example` to `.env.local`.
2. Generate a long session secret: `openssl rand -base64 48`.
3. Generate one scrypt password hash per admin with `node scripts/hash-admin-password.mjs`.
4. Set the hashes in the matching `ADMIN_PASSWORD_HASH_*` variables.

Passwords are never stored in plaintext. Sessions use signed, HttpOnly cookies, and login attempts are rate-limited. The authentication path uses no SQL queries, so user input cannot become SQL syntax.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
