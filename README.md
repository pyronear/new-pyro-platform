# New pyronear platform


## Local setup

Use `fnm` to ensure you always use the correct node version:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

Reload your terminal and go back to this folder. It should prompt you to download the correct Node version. If that's not the case, simply run `fnm use`.

Then install pnpm:

```bash
npm i -g pnpm
```

Then install all dependencies:

```bash
pnpm i
```

You should now be able to run the website locally with

```bash
pnpm run dev
```