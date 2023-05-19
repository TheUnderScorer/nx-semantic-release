# @goestav/nx-semantic-release

> This fork supports the [ESM import syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

[nx](https://nx.dev/) plugin for automated releases, powered
by [semantic-release](https://github.com/semantic-release/semantic-release)

## How it works

Under the hood, it uses project graph from nx to analyze commits for every configured project and filters out these commits that doesn't affect given project or it's dependencies.

<a href="https://www.buymeacoffee.com/theunderscorer" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Installation

Run:

```shell
npm install -D @goestav/nx-semantic-release
nx g @goestav/nx-semantic-release:install
```

For now this package supports only <b>Independent</b> versioning mode, synced mode is planned to be added soon.

## Usage

In order to release your projects, add this executor to your configuration file (ex. `project.json`), bare minimal
configuration looks like this:

```json
{
  "semantic-release": {
    "executor": "@goestav/nx-semantic-release:semantic-release"
  }
}
```

> Hint: You can also use our generator `nx g @goestav/nx-semantic-release:setup-project $PROJECT_NAME` to generate this configuration.

After running this, the executor will do the following:

- Filter commits retrieved by semantic-release in order to find only these that affects selected project or it's
  dependencies.
- Perform semantic-release using following plugins (in this order:)
  - @semantic-release/commit-analyzer
  - @semantic-release/release-notes-generator
  - @semantic-release/changelog
  - @semantic-release/npm
  - @semantic-release/git
  - @semantic-release/github
- The result will be a fully versioned project. If you are releasing it as npm package, the package will be built,
  version in package.json will be updated and package itself will be published.

## Configuration

Options can be configured in 3 ways:

1. **cli**: Passing them on the cli command
2. **config file:** Including them in a global `nxrelease` config file in the root of your monorepo (see below)
3. **project:** Within the options section of the executor for each project (`project.json`)

Multiple configurations are fully supported, allowing for global configuration options in the config file and then project specific overrides in the `project.json`. Options merged in the following order of precedence:

```
cli flags > project > config file > defaults
```

_Note:_ Object/Array type options are shallowly merged. For example, if gitAssets is set in both the config file and the project options, the whole of the project options version will be used and the config file option will be discarded.

### Configuration file

nx-semantic-release's options can be set globally via either:

- a `nxrelease` key in the project's `package.json` file
- a `.nxreleaserc` file, written in YAML or JSON, with optional extensions: `.yaml`/`.yml`/`.json`/`.js`
- a `nxrelease.config.js` file that exports an object

The following examples are all the same.

- Via `nxrelease` key in the monorepo `package.json` file:

```json
{
  "nxrelease": {
    "repositoryUrl": "https://github.com/TheUnderScorer/nx-semantic-release"
  }
}
```

- Via `.nxreleaserc` YAML file:

```yaml
---
repositoryUrl: 'https://github.com/TheUnderScorer/nx-semantic-release'
```

- Via `nxrelease.config.js` file:

```js
module.exports = {
  repositoryUrl: 'https://github.com/TheUnderScorer/nx-semantic-release',
};
```

- Via CLI arguments:

```
$ nx semantic-release app-c --repositoryUrl "https://github.com/TheUnderScorer/nx-semantic-release"
```

### Available Options

| name           | type               | default                                                                    | required | description                                                                                                                                                                                                                                                                                                                     |
| -------------- | ------------------ | -------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dryRun         | boolean            | false                                                                      | no       | See what commands would be run, without committing to git or updating files                                                                                                                                                                                                                                                     |
| ci             | boolean            | true                                                                       | no       | Set to false to skip CI checks.                                                                                                                                                                                                                                                                                                 |
| changelog      | boolean            | true                                                                       | no       | Whether to generate changelog.                                                                                                                                                                                                                                                                                                  |
| changelogFile  | string             | ${PROJECT_DIR}/CHANGELOG.md                                                | yes      | Path to changelog file.                                                                                                                                                                                                                                                                                                         |
| repositoryUrl  | string             | repositoryUrl                                                              | no       | The URL of the repository to release from.                                                                                                                                                                                                                                                                                      |
| tagFormat      | string             | ${PROJECT_NAME}-v${version}                                                | no       | Tag format to use. You can refer to [semantic-release configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#tagformat)                                                                                                                                                    |
| npm            | boolean            | true                                                                       | no       | Whether to bump package.json version and publish to registry (if package is public).                                                                                                                                                                                                                                            |
| git            | boolean            | true                                                                       | no       | Whether to create git commit and tag. See more in [@semantic-release/git](https://github.com/semantic-release/git).                                                                                                                                                                                                             |
| github         | boolean            | true                                                                       | no       | Whether to create github release.                                                                                                                                                                                                                                                                                               |
| buildTarget    | string             |                                                                            | no       | The target of the build command. If your package is public and you want to release it to npm as part of release, you have to provide it. Plugin will use it to build your package and set version in package.json before releasing it to npm registry.                                                                          |
| outputPath     | string             |                                                                            | no       | The path to the output directory. Provide that if your package is public and you want to publish it into npm.                                                                                                                                                                                                                   |
| commitMessage  | string             | chore(release): ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes} | no       | The commit message to use when committing the release. You can refer to [@semantic-release/git](https://github.com/semantic-release/git#options).                                                                                                                                                                               |
| gitAssets      | string[]           |                                                                            | no       | Path to additional assets that will be commited to git with current release.                                                                                                                                                                                                                                                    |
| plugins        | PluginSpec[]       |                                                                            | no       | Additional plugins for semantic-release. Note: these plugins will be added before @semantic-release/git, which means that you can assets generated by them to git as well. Supports the same format as [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#plugins) |
| branches       | BranchSpec[]       |                                                                            | no       | Branches configuration for workflow release. Supports the same format as [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#branches)                                                                                                                              |
| packageJsonDir | string             | ${PROJECT_DIR}                                                             | no       | Path to package.json file (usable only if npm is true). Note: it should point to directory in which package.json can be found, not to file itself.                                                                                                                                                                              |
| parserOpts     | object             |                                                                            | no       | Parser options used by commit-analyzer and @semantic-release/release-notes-generator and @semantic-release/changelog                                                                                                                                                                                                            |
| writerOpts     | object             |                                                                            | no       | Writer options used by commit-analyzer and @semantic-release/release-notes-generator                                                                                                                                                                                                                                            |
| linkCompare    | boolean            | true                                                                       | no       | Whether to include a link to compare changes since previous release in the release note.                                                                                                                                                                                                                                        |
| linkReferences | boolean            | true                                                                       | no       | Whether to include a link to issues and commits in the release note.                                                                                                                                                                                                                                                            |
| releaseRules   | string or object[] |                                                                            | no       | Release rules are used when deciding if the commits since the last release warrant a new release. Supports the same format as [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer#releaserules)                                                                                             |

### Available Tokens

| Token            | Expands into                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------- |
| ${PROJECT_DIR}   | Resolves to the current project direcory (ex. `/Users/theunderscorer/nx-monorepo/apps/app-a`) |
| ${PROJECT_NAME}  | Resolves to the current project name (ex. `app-a`)                                            |
| ${WORKSPACE_DIR} | Resolves to the current workspace direcory (ex. `/Users/theunderscorer/nx-monorepo`)          |

The following options support tokens: `buildTarget`, `changelogFile`, `commitMessage`, `gitAssets`, `packageJsonDir`, `outputPath`, `plugins`'s options<sup>\*</sup>, and `tagFormat`.

You may see other tokens like `${nextRelease.version}`, those are tokens that are replaced by semantic-release itself.

> <sup>\*</sup>: The replacement of tokens in `plugins` only occurs for plugins which are specified with options, using [semantic-release's syntax](https://semantic-release.gitbook.io/semantic-release/usage/plugins#plugin-options-configuration)
> For example:
>
> ```
> plugins: [
>             '@fake/plugin-without-options1',
>             [
>               '@semantic-release/exec',
>               {
>                 prepareCmd: 'cp LICENSE dist/packages/${PROJECT_NAME} && cp README.md dist/packages/${PROJECT_NAME}',
>                 execCwd: '${WORKSPACE_DIR}',
>                 fakeStringArrayOption: ['${WORKSPACE_DIR}/src', '${WORKSPACE_DIR}/dist'],
>                 fakeBooleanOption: true,
>                 fakeNumberOption: 10
>               }
>             ],
>             '@fake/plugin-without-options2',
>         ]
> ```
>
> In above example, tokens will be replaced only for `@semantic-release/exec` plugin, and only for its `string|string[]` options, others will be left untouched.

### Build target

By setting `buildTarget` option plugin will run your build executor as part of the release, which is useful if ex. you
want to publish released package to npm registry.

## Skipping commits

You can skip commits for given projects using `[skip $PROJECT_NAME]` in its body. Ex:

```
  feat: update something

  [skip my-app1]
  [skip my-app2]
```

During analysis this commit will be skipped for release pipeline for `my-app1`, `my-app2`.
You can also use `[skip all]` to skip commit for all projects or **one single** `[skip my-app1, my-app2]` to skip commits related to `my-app1`, `my-app2` at once.

---

Alternatively you can include only particular projects in given commit by using `[only $PROJECT_NAME]`. Ex:

```
  feat: update something

  [only my-app1]
  [only my-app2]
```

During analysis this commit will be included only for release pipeline for `my-app`, `my-app2`.
You can also use **one single** `[skip my-app1, my-app2]` to skip commits related to `my-app1`, `my-app2` at once.

## Releasing multiple apps/libraries at once

You can release multiple apps/libraries at once by using `nx run-many`:

```shell
npx nx run-many --target=semantic-release --parallel=false
```

> Note: `--parallel=false` is required to run tasks sequentially, otherwise `nx run-many` will run tasks in parallel and semantic-release will fail.

## CI/CD

Example of GitHub actions workflow:

```yaml
name: default

on:
  push:
    branches:
      - 'master'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: configure git
        run: |
          git config user.name "${GITHUB_ACTOR}"
          git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"

      - run: npm ci

      - run: npx nx run my-app:semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
