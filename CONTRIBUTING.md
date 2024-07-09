# Contributing to nx-semantic-release

Do you want to contribute to the project? Thats great! 🎉

Read more below to get started:

## Development

After cloning repo run:

```shell
pnpm install
```

In order to run tests run:

```shell
pnpm test
```

> Note: E2E tests use `@nx/plugin` for generating test workspace. You can learn more about it [here](https://nx.dev/packages/nx-plugin).

## Working with code

The master branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues, first.

## Commiting changes

The project follows [Conventional Commits](https://conventionalcommits.org/) for committing changes.

## How to publish

The package is automatically published on every push to `master` branch if there are relevant changes.
