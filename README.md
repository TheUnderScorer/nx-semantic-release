# @theunderscorer/nx-semantic-release

[nx](https://nx.dev/) plugin for automated releases, powered
by [semantic-release](https://github.com/semantic-release/semantic-release)

## Installation

Run:

```shell
npm install -D @theunderscorer/nx-semantic-release
```

For now this package supports only <b>Independent</b> versioning mode, synced mode is planned to be added soon.

## Usage

In order to release your projects, add this executor to your configuration file (ex. `workspace.json`), bare minimal
configuration looks like this:

```json
{
  "semantic-release": {
    "executor": "@theunderscorer/nx-semantic-release:semantic-release",
    "options": {
      "buildTarget": "my-app:build",
      "repositoryUrl": "https://github.com/YourName/YourRepo",
      "outputPath": "dist/apps/my-app"
    }
  }
}
```

After running this, the executor will do the following:

* Filter commits retrieved by semantic-release in order to find only these that affects selected project or it's
  dependencies.
* Perform semantic-release using following plugins (in this order:)
  * @semantic-release/commit-analyzer
  * @semantic-release/release-notes-generator
  * @semantic-release/changelog
  * @semantic-release/npm
  * @semantic-release/git
  * @semantic-release/github
* The result will be a fully versioned project. If you are releasing it as npm package, the package will be built,
  version in package.json will be updated and package itself will be published.

### Configuration

| name           | type         | default                                                                        | required | description                                                                                                                                                                                                                                                                                                                     |
|----------------|--------------|--------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dryRun         | boolean      | false                                                                          | no       | See what commands would be run, without committing to git or updating files                                                                                                                                                                                                                                                     |
| ci             | boolean      | true                                                                           | no       | Set to false to skip CI checks.                                                                                                                                                                                                                                                                                                 |
| changelog      | boolean      | true                                                                           | no       | Whether to generate changelog.                                                                                                                                                                                                                                                                                                  |
| changelogFile  | string       | ${PROJECT_DIR}/CHANGELOG.md                                                    | no       | Path to changelog file. $PROJECT_DIR will be resolved to current project directory.                                                                                                                                                                                                                                             |
| repositoryUrl  | string       | repositoryUrl                                                                  | no       | The URL of the repository to release from.                                                                                                                                                                                                                                                                                      |
| tagFormat      | string       |                                                                                | no       | Tag format to use. You can refer to [semantic-release configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#tagformat)                                                                                                                                                    |
| npm            | boolean      | true                                                                           | no       | Whether to bump package.json version and publish to registry (if package is public).                                                                                                                                                                                                                                            |
| github         | boolean      | true                                                                           | no       | Whether to create github release.                                                                                                                                                                                                                                                                                               |
| buildTarget    | string       |                                                                                | no       | The target of the build command. If your package is public and you want to release it to npm as part of release, you have to provide it. Plugin will use it to build your package and set version in package.json before releasing it to npm registry.                                                                          |
| outputPath     | string       |                                                                                | no       | The path to the output directory. Provide that if your package is public and you want to publish it into npm.                                                                                                                                                                                                                   |
| commitMessage  | string       | chore(release): ${nextRelease.version} [skip ci] \\ n \\ n${nextRelease.notes} |          | The commit message to use when committing the release. You can refer to [@semantic-release/git](https://github.com/semantic-release/git#options).                                                                                                                                                                               |
| gitAssets      | string[]     |                                                                                | no       | Path to additional assets that will be commited to git with current release.                                                                                                                                                                                                                                                    |
| plugins        | PluginSpec[] |                                                                                | no       | Additional plugins for semantic-release. Note: these plugins will be added before @semantic-release/git, which means that you can assets generated by them to git as well. Supports the same format as [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#plugins) |
| branches       | BranchSpec[] |                                                                                | no       | Branches configuration for workflow release. Supports the same format as [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#branches)                                                                                                                              |
| packageJsonDir | string       | ${PROJECT_DIR}                                                                 | no       | Path to package.json file (usable only if npm is true). Note: it should point to directory in which package.json can be found, not to file itself.                                                                                                                                                                              |
| parserOpts     | object       |                                                                                | no       | Parser options used by commit-analyzer and @semantic-release/release-notes-generator and @semantic-release/changelog                                                                                                                                                                                                            |
| writerOpts     | object       |                                                                                | no       | Writer options used by commit-analyzer and @semantic-release/release-notes-generator                                                                                                                                                                                                                                            |

#### Build target

By setting `buildTarget` option plugin will run your build executor as part of the release, which is useful if ex. you
want to publish released package to npm registry.

#### Skipping commits

You can skip commits for given project using `[skip $PROJECT_NAME]` in its body. Ex:

```
  feat: update something
  
  [skip my-app]
```
During analysis this commit will be skipped for release pipeline for my-app.

You can also use `[skip all]` to skip commit for all projects..

### CI/CD

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

### Development

After cloning repo run:

```shell
npm install
```

It will also automatically setup test workspace at `test-repos/app` directory.

In order to run tests run:

```shell
npm run test
```
