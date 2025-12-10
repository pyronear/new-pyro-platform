# New pyronear platform

## Global description of the project

See [Description](./docs/repo_documentation.md)

## Local setup

### 1. Install nodejs

The node version is specified in `./.nvmrc` file
We strongly recommend to use a version manager to deal with node version, rather than downloading directly node
(easier in case of updates)

**Option A : fnm**
Use `fnm` to ensure you always use the correct node version:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

Reload your terminal and go back to this folder. It should prompt you to download the correct Node version.
If that's not the case, simply run `fnm install` (it download the version specified in the file ./.nvmrc ).

**Option B : nvm**
See github repo to know how to install it
Then execute

```bash
nvm use {NODE_VERSION}
```

### 2. Install pnpm

In this project we use pnpm rather the default package manager npm

Execute the following command:

```bash
npm install -g pnpm
```

### 3. Install project dependencies

Install all dependencies with pnpm:

```bash
pnpm install
```

It should create a `/node_modules`directory

### 4. Configure .env file

You'll need a valid .env file to run this app properly.

- Duplicate the file `/public/config/app-config.js`and rename it `/public/config/app-config-dev.js`
- In `/public/config/app-config-dev.js`, fill the local parameters
  - API_URL
  - LIVE_STREAMING_MEDIA_URL
  - LIVE_STREAMING_SITE_PORT

Note to configure the parameter `API_URL` in `/config/app-config-dev.js` file:

- Use an existing API (staging, or prod if you're brave)
- OR you can run the [Pyronear Dev Environment](https://github.com/pyronear/pyro-envdev) locally

**Keep in mind to synchronize your app-config-dev.js file with app-config-example.js :**
**If new properties are added to the app-config-dev.js file, it must be also added to your file app-config-local.js**

### 5. Run the project !

You should now be able to run the website locally with

```bash
pnpm run dev
```

**Once the setup is done, next time you want to run the app, you need to execute only the last step**

## Contributing

The code is formatted by prettier and eslint. Please download those extensions in your IDEA to enable automatic formatting on save.
