## [2.6.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.5.0...nx-semantic-release-v2.6.0) (2023-08-24)


### Features

* apply tokens to every configuration field, including nested arrays and objects ([1c4b886](https://github.com/TheUnderScorer/nx-semantic-release/commit/1c4b8861037dd9da5f5e4fad6197eb1a78e2a520))

## [2.5.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.4.1...nx-semantic-release-v2.5.0) (2023-07-16)


### Features

* support passing options for @semantic-release/github plugin ([5d3ac04](https://github.com/TheUnderScorer/nx-semantic-release/commit/5d3ac04b096e247c1279c1a75e0e47689de6b69b))

## [2.4.1](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.4.0...nx-semantic-release-v2.4.1) (2023-07-16)


### Bug Fixes

* Allow for `preset` to be set in project configuration file ([3fb9244](https://github.com/TheUnderScorer/nx-semantic-release/commit/3fb9244a1ae318fdee2871c672e0e61ecfaf5a16)), closes [#80](https://github.com/TheUnderScorer/nx-semantic-release/issues/80)

## [2.4.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.3.0...nx-semantic-release-v2.4.0) (2023-04-30)


### Features

* update to nx 16 ([8d70eed](https://github.com/TheUnderScorer/nx-semantic-release/commit/8d70eed0c055862322a1943ea9f5a2597e998885))

## [2.3.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.2.1...nx-semantic-release-v2.3.0) (2023-04-08)


### Features

* update nx to 15.9.2 ([a09aba5](https://github.com/TheUnderScorer/nx-semantic-release/commit/a09aba58346cc4d9280ce3c9ce31b92398daebcb))

## [2.2.1](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.2.0...nx-semantic-release-v2.2.1) (2023-03-28)


### Bug Fixes

* await filterAffected ([54f42ad](https://github.com/TheUnderScorer/nx-semantic-release/commit/54f42ad8118f19769c9ebccec6af06321a26e35e))

## [2.2.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.1.0...nx-semantic-release-v2.2.0) (2023-03-27)


### Features

* add `${WORKSPACE_DIR}` token that resolves to workspace directory ([11b1c60](https://github.com/TheUnderScorer/nx-semantic-release/commit/11b1c600eed0a2478c7d582cc395884c86b6e145))
* replace tokens in `outputPath` option ([10508ae](https://github.com/TheUnderScorer/nx-semantic-release/commit/10508aea18297c3741242466a968a9001ccc1759))
* replace tokens in `plugins`' options of type `string | string[]` ([57f00f5](https://github.com/TheUnderScorer/nx-semantic-release/commit/57f00f5db5e9f9ec8ce1e7ecf9b0fbf61b86fe38))


### Bug Fixes

* replace all occurences of a token in an option, not only the first one ([320877a](https://github.com/TheUnderScorer/nx-semantic-release/commit/320877ab70ceaac58bfc37cfa5de4b7265284cbf))

## [2.1.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.0.1...nx-semantic-release-v2.1.0) (2023-03-22)


### Features

* Allow disabling @semantic-release/git plugin ([d515817](https://github.com/TheUnderScorer/nx-semantic-release/commit/d515817a02cb0dcfbec4f641e8998edd59017f56))

## [2.0.1](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v2.0.0...nx-semantic-release-v2.0.1) (2023-03-07)


### Bug Fixes

* Support nested nx repositories ([83fc543](https://github.com/TheUnderScorer/nx-semantic-release/commit/83fc5435edb9673bf0bde4ebc18b2d9a049803ea))

## [2.0.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.14.0...nx-semantic-release-v2.0.0) (2023-02-20)


### ⚠ BREAKING CHANGES

* this package requires node version >= 16 from now on

### Features

* set minimal required node version to 16 ([390b2af](https://github.com/TheUnderScorer/nx-semantic-release/commit/390b2af17ee01c20ac68a08c67a9e49c0205bf76))
* support setting `release` to `false` in `releaseRules` ([8b6df0e](https://github.com/TheUnderScorer/nx-semantic-release/commit/8b6df0ea770860d56e34eaec470b9d39a32fcea9))


### Build System

* **deps:** add @nrwl/tao as dependency ([3da27fc](https://github.com/TheUnderScorer/nx-semantic-release/commit/3da27fc7283ecb7ccf75e0ae179e81a4e147a4e0))
* **deps:** update nx ([3b28226](https://github.com/TheUnderScorer/nx-semantic-release/commit/3b2822685d0a6c1dff33d0115f14f2dee0512ee4))
* **deps:** update semantic-release to 20.1.0 ([aa41541](https://github.com/TheUnderScorer/nx-semantic-release/commit/aa4154160feaf97b443dfb4cd702518991c63ef7))

## [1.14.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.13.0...nx-semantic-release-v1.14.0) (2022-07-15)


### Features

* support "preset" and "presetConfig" configuration ([de27b64](https://github.com/TheUnderScorer/nx-semantic-release/commit/de27b64f0db21daf0670be77ed21bfce3d823cf8))


### Build System

* **deps:** update and freeze dependencies ([7902b33](https://github.com/TheUnderScorer/nx-semantic-release/commit/7902b3360a76b3976f7c610f4753af2910181114))

# [1.13.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.12.0...nx-semantic-release-v1.13.0) (2022-06-27)


### Features

* Introduce @theunderscorer/nx-semantic-release:setup-project generator ([8d31901](https://github.com/TheUnderScorer/nx-semantic-release/commit/8d31901d2ac17018ac9f97b615199696938fbcfc))

# [1.12.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.11.0...nx-semantic-release-v1.12.0) (2022-06-26)


### Features

* Introduce @theunderscorer/nx-semantic-release:install generator ([22aaec8](https://github.com/TheUnderScorer/nx-semantic-release/commit/22aaec88b3ffb7e42764d38bf32e30bb9995cb39))
* remove "git" option ([9191bae](https://github.com/TheUnderScorer/nx-semantic-release/commit/9191bae9f1673f68f4c5c146300eea8f3004f25b))
* Support latest nx version (14.3.6) ([31b897c](https://github.com/TheUnderScorer/nx-semantic-release/commit/31b897cbd36881918910ab7a53bb58d9baa17edb))

# [1.11.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.10.0...nx-semantic-release-v1.11.0) (2022-05-27)


### Features

* Introduce [only] flag for including only selected projects for given commit ([f0c4021](https://github.com/TheUnderScorer/nx-semantic-release/commit/f0c40219f4ac7a7a59741bf7b94ac760e360307c))

# [1.10.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.9.1...nx-semantic-release-v1.10.0) (2022-05-14)


### Features

* Support latest nx version (14.1.5) ([3d0b5d1](https://github.com/TheUnderScorer/nx-semantic-release/commit/3d0b5d151d5b86359f9c48710da52db4ffeac5ca))

## [1.9.1](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.9.0...nx-semantic-release-v1.9.1) (2022-04-26)


### Bug Fixes

* Use dependencies instead of peerDependencies ([aa1fc19](https://github.com/TheUnderScorer/nx-semantic-release/commit/aa1fc1979ab22c01b05969ead3591081a7222873))

# [1.9.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.8.2...nx-semantic-release-v1.9.0) (2022-04-17)


### Features

* Update to latest nx version (13.10.2) ([34ea0d6](https://github.com/TheUnderScorer/nx-semantic-release/commit/34ea0d6c5006c6c46e8ecb5bde2a1a8bcdf05a88))

## [1.8.2](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.8.1...nx-semantic-release-v1.8.2) (2022-04-15)


### Bug Fixes

* remove extra slash in commitMessage ([3f22e97](https://github.com/TheUnderScorer/nx-semantic-release/commit/3f22e976876a4ea030f97758f423ac3928775def))

## [1.8.1](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.8.0...nx-semantic-release-v1.8.1) (2022-04-15)


### Bug Fixes

* honor the packageJsonDir option in the gitAssets ([4f88a28](https://github.com/TheUnderScorer/nx-semantic-release/commit/4f88a28b09c78823ebf69414c6f04b61da54186c))
* use posix path format for default git assets ([9c251c5](https://github.com/TheUnderScorer/nx-semantic-release/commit/9c251c5377c271cf2a5fc41b791a9f7a4cd1f8ae))

# [1.8.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.7.0...nx-semantic-release-v1.8.0) (2022-03-29)


### Features

* Introduce new options: releaseRules, linkCompare and linkReferences ([8eb1f5b](https://github.com/TheUnderScorer/nx-semantic-release/commit/8eb1f5b239bb10ac40cf176384e0f067298963ba))

# [1.7.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.6.0...nx-semantic-release-v1.7.0) (2022-03-29)


### Features

* Add support for global configuration ([9ec58f4](https://github.com/TheUnderScorer/nx-semantic-release/commit/9ec58f43e529509792777cd7ebc9d21f0ddf4a7b))

# [1.6.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.5.0...nx-semantic-release-v1.6.0) (2022-03-24)


### Features

* Improve token support ([5bcf7f9](https://github.com/TheUnderScorer/nx-semantic-release/commit/5bcf7f9767185521ac3ea7001b8e80c340cb6ace))

# [1.5.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.4.2...nx-semantic-release-v1.5.0) (2022-03-19)


### Features

* Support passing parserOpts and writerOpts ([00bc505](https://github.com/TheUnderScorer/nx-semantic-release/commit/00bc505a892a9242cc65562b473a1bba64201191))

## [1.4.2](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.4.1...nx-semantic-release-v1.4.2) (2022-02-16)


### Bug Fixes

* Add other missing dependencies ([4b6cc98](https://github.com/TheUnderScorer/nx-semantic-release/commit/4b6cc98509d2754bc08d20f1838f2e5c9b049651))

## [1.4.1](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.4.0...nx-semantic-release-v1.4.1) (2022-02-16)


### Bug Fixes

* Add missing "semantic-release-plugin-decorators" dependency to the package ([719b39a](https://github.com/TheUnderScorer/nx-semantic-release/commit/719b39a67eebcbc5b9e816baa7ee8f8f3f9a7b42))

# [1.4.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.3.0...nx-semantic-release-v1.4.0) (2022-02-15)


### Features

* support skipping commits manually ([99aea60](https://github.com/TheUnderScorer/nx-semantic-release/commit/99aea607bf0da101f88b1b80506ea4ef28343f52))

# [1.3.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.2.1...nx-semantic-release-v1.3.0) (2022-02-04)


### Features

* support latest NX version ([ade9bd1](https://github.com/TheUnderScorer/nx-semantic-release/commit/ade9bd17b3c2644a6c8ad9eac200998b66f90226))

## [1.2.1](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.2.0...nx-semantic-release-v1.2.1) (2021-12-19)


### Bug Fixes

* add missing plugin steps (prepare and success) ([6f95c54](https://github.com/TheUnderScorer/nx-semantic-release/commit/6f95c54155f4dc5685802f5e986a6e28a0188d47))

# [1.2.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.1.0...nx-semantic-release-v1.2.0) (2021-12-18)


### Features

* support passing package.json path ([491397f](https://github.com/TheUnderScorer/nx-semantic-release/commit/491397fedb37a3cdaa2af743708cedeb8d2d5f43))

# [1.1.0](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.0.5...nx-semantic-release-v1.1.0) (2021-12-15)


### Features

* calculate affected files using project graph ([609de85](https://github.com/TheUnderScorer/nx-semantic-release/commit/609de85a29da0dd33587f643ea2ee2f7373462cc))

## [1.0.5](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.0.4...nx-semantic-release-v1.0.5) (2021-12-10)


### Bug Fixes

* fix library plugins being overwritten by user provided plugins ([9d33e2d](https://github.com/TheUnderScorer/nx-semantic-release/commit/9d33e2d6f92459cc42b724f21bc6acece645b184))

## [1.0.4](https://github.com/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.0.3...nx-semantic-release-v1.0.4) (2021-12-09)


### Bug Fixes

* remove invalid host in release-notes-generator ([ade0624](https://github.com/TheUnderScorer/nx-semantic-release/commit/ade06241cc0141718db6c994742892d2298bc62d))

## [1.0.3](http://localhost/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.0.2...nx-semantic-release-v1.0.3) (2021-12-09)


### Bug Fixes

* add missing [@semantic-release](http://localhost/semantic-release) dependencies ([02c79f1](http://localhost/TheUnderScorer/nx-semantic-release/commit/02c79f125de9039a9af4ed09443b7e93c5a20319))

## [1.0.2](http://localhost/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.0.1...nx-semantic-release-v1.0.2) (2021-12-09)


### Bug Fixes

* add "semantic-release-plugin-decorators" as dependency ([ce2aecd](http://localhost/TheUnderScorer/nx-semantic-release/commit/ce2aecd904ebad6330bd24abbb57f38de65f4c1e))

## [1.0.1](http://localhost/TheUnderScorer/nx-semantic-release/compare/nx-semantic-release-v1.0.0...nx-semantic-release-v1.0.1) (2021-12-09)


### Bug Fixes

* invalid documentation url ([4757077](http://localhost/TheUnderScorer/nx-semantic-release/commit/47570771a92132c18e66c559ea08df5b2307b7dd))

# 1.0.0 (2021-12-09)


### Features

* initial release ([c196a27](http://localhost/TheUnderScorer/nx-semantic-release/commit/c196a279a299ab4228037f7ea81e1726a61c93f9))
