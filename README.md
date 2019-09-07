# firebase

Simplify the workflow of developing Firebase applications.

## Key Features

- Configure & deploy Firebase environment variables.

## Getting Started

This library assumes the Firebase tools have been installed and are accessible (i.e. in the `PATH`). If you do not have the Firebase tools or are unsure, run `npm install -g firebase-tools` and see the [CLI documentation](https://github.com/firebase/firebase-tools) for details.

Install this utility as a development dependency within your project.

```sh
npm install @butlerlogic/firebase --save-dev
```

If you want to use the commands directly (i.e. _not_ within an npm command), you'll _also_ need to install the library with the global flag.

```sh
npm install -g @butlerlogic/firebase
```

## Firebase Functions

Firebase functions are, generally, pretty straightforward to work with. However; synchronizing environment variables is more challenging, especially in team environments.

Environment variables are managed in a file called `.runtimeconfig.json`. This file should never be committed to git, which means it is never available when you start working on a project.

If you are working with an existing project, run `fb setup` to automatically generate the appropriate `.runtimeconfig.json` file. It does not know what the values of each environment variable should be, but it will identify all of the variables used in the code base and structure the file properly.

There is also a command that will read the `.runtimeconfig.json` and automatically update the remote Firebase environment with the values found in the file. This can be done by running `fb configure`

### Recommendation

It's typically best to set this up as an npm command. Consider the following package.json:

```json
{
  "name": "my_firebase_functions",
  "version": "1.0.0",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "serve": "firebase serve --only functions,database",
    "shell": "firebase functions:shell",
    "start": "firebase emulators:start --only functions",
    "logs": "firebase functions:log",
    "deploy": "fb deploy",
    "configure": "fb configure",
    "setup": "fb setup"
  },
  "engines": {
    "node": "8"
  },
  "dependencies": {
    "firebase-admin": "^8.0.0",
    "firebase-functions": "^3.1.0"
  },
  "devDependencies": {
    "@butlerlogic/firebase": "^1.0.0",
  },
  "private": true
}
```