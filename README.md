# New pyronear platform

## Local setup

You'll need a valid .env file to run this app properly. You can either

- Use an existing API (staging, or prod if you're brave)
- Run the [backend repo](github.com/pyronear/pyro-api) locally

Use `fnm` to ensure you always use the correct node version:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

Reload your terminal and go back to this folder. It should prompt you to download the correct Node version.
If that's not the case, simply run `fnm install` (it download the version specified in the file ./.nvmrc ).

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

## Contributing

The code is formatted by prettier and eslint. Please download those extensions in your IDEA to enable automatic formatting on save.
