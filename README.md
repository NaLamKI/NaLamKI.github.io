# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. You can access the documentation that is created for the Nalamki plattform on this [webpage](https://nalamki.github.io/). 

If you are here, because you support this project by writing the documentation for the Nalamki software, then you need to follow these steps. 

## Installation & local development

First you need to install Node.js. Please follow the steps on this [page](https://nodejs.org/en/download/package-manager) regarding the operating system you are working with. Please also check the [docusaurus documentation page](https://docusaurus.io/docs/installation) to find out which version of Node.js you need. 

### npm

When you installed Node.js and every time you want to update the version of the webpage, you run:

```
npm install

# If you prefert to use yarn
# You do this instead for the first time: 
sudo npm install --global yarn
# Later you you just use this: 
yarn install

```

Then you can run the documentation webpage on your machine locally on the localhost:3000 by using following command:

```
npm run start

# If you prefert to use yarn, you do this instead:
yarn start

```


### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
