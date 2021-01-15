# SpeedyTuner

Slick and modern way to tune your [Speeduino ECU](https://speeduino.com/).

## Project main goals

- 🚀 always free and open source (FOSS)
- 💻 cross-platform desktop and mobile app
- 🤗 great user experience
  - modern and responsive UI
  - fast startup, low resource consumption
  - touch screen support
  - 60 FPS animations
- 🔥 fully featured
  - all the tuning essentials and beyond

## The repository

This repository contains code for 2 cross-platform apps:

- [Desktop](https://github.com/karniv00l/speedy-tuner/releases) (Windows, Linux, macOs, Raspberry Pi)
- [Web](https://speeduino.cloud) share and view tunes + logs ([https://speeduino.cloud](https://speeduino.cloud))
- ~~Mobile (Android, iOS)~~

Written in [TypeScript](https://github.com/microsoft/TypeScript) using [React](https://github.com/facebook/react) and [Electron](https://github.com/electron/electron).

## ECU firmware

Source code: [noisymime/speeduino](https://github.com/noisymime/speeduino).

## Related tools 🛠

Additional tools and components created during development:

- [Trigger simulator](https://github.com/karniv00l/trigger-sim)
- [MLG logs converter](https://github.com/karniv00l/mlg-converter)
- [INI parser](https://github.com/karniv00l/speeduino-ini-parser)
- [INI linter](https://github.com/karniv00l/speeduino-ini-linter)

## Contributing 🤝

There are many ways in which you can participate in the project and every bit of help is greatly appreciated.

- 🐞 [Submit bugs and feature requests](https://github.com/karniv00l/speedy-tuner/issues)
- 🧪 Test on different platforms, hardware and Speeduino firmware
- 👓 Review source code
- ⌨️ Write tests and refactor code according to best practices

### Recommended dev environment

- [Node LTS](https://nodejs.org/) 14.x.x
- [Visual Studio Code](https://code.visualstudio.com/) with following extensions:
  - [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
  - [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
