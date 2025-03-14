# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.18.8](https://github.com/darkobits/nr/compare/v0.18.7...v0.18.8) (2025-03-02)

### [0.18.7](https://github.com/darkobits/nr/compare/v0.18.6...v0.18.7) (2025-02-27)


### Bug Fixes

* Do not await killed child process. ([f688f0c](https://github.com/darkobits/nr/commit/f688f0c9cd16d0b82429be186647b746ddafec6c))

### [0.18.6](https://github.com/darkobits/nr/compare/v0.18.5...v0.18.6) (2025-02-27)


### Bug Fixes

* Improve error handling for processes killed via POSIX signals. ([55f7611](https://github.com/darkobits/nr/commit/55f76115d97b55bdfad0d943c5aa9a02da5ca8ab))

### [0.18.5](https://github.com/darkobits/nr/compare/v0.18.4...v0.18.5) (2025-02-22)

## [0.18.4](https://github.com/darkobits/nr/compare/v0.18.3...v0.18.4) (2025-01-05)

### 🏗 Chores

* **deps:** Update dependencies. ([f166da2](https://github.com/darkobits/nr/commit/f166da26171890297cddb48ead16fd74c5598a08))

## [0.18.3](https://github.com/darkobits/nr/compare/v0.18.2...v0.18.3) (2025-01-05)

### 🐞 Bug Fixes

* Remove `rootDir` from `tsconfig`. ([a73b1ca](https://github.com/darkobits/nr/commit/a73b1ca8e1bf27fead2af794db74f51188072783))

## [0.18.2](https://github.com/darkobits/nr/compare/v0.18.1...v0.18.2) (2024-12-07)

### 🏗 Chores

* **deps:** Update dependencies. ([7bcf0d6](https://github.com/darkobits/nr/commit/7bcf0d6e52a58f4da14259ea50f890a96c4ca307))

## [0.18.1](https://github.com/darkobits/nr/compare/v0.18.0...v0.18.1) (2024-12-02)

### 🏗 Chores

* **deps:** Update dependencies. ([2fd216f](https://github.com/darkobits/nr/commit/2fd216f05da379ada2df874961a96ea1cb301b57))
* **deps:** Update dependencies. ([9e19301](https://github.com/darkobits/nr/commit/9e193013b2184ae1c28964be8d8dcf23b3ce18f1))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.18.0](https://github.com/darkobits/nr/compare/v0.17.2...v0.18.0) (2024-07-08)


### ⚠ BREAKING CHANGES

* Before:

```ts
import defineConfig from '@darkobits/nr'
```

After:

```ts
import { defineConfig } from '@darkobits/nr'
```

### 🏗 Chores

* **deps:** Update dependencies. ([d5c71a2](https://github.com/darkobits/nr/commit/d5c71a233a50cbe281ced8f55d29d5656c446287))
* Misc. cleanup. ([8dbe3f5](https://github.com/darkobits/nr/commit/8dbe3f542ab7eb11471864cded2ee07f66d0ca7c))


### 🛠 Refactoring

* Make `defineConfig` a named export. ([f17bd79](https://github.com/darkobits/nr/commit/f17bd79efe8cde8e543fa1d70591d9a4621fa477))
* Require Node 18. ([bfc0192](https://github.com/darkobits/nr/commit/bfc019289cae5690b265a9fdcd8ece2aac712650))

## [0.17.2](https://github.com/darkobits/nr/compare/v0.17.1...v0.17.2) (2024-07-08)


### 🏗 Chores

* **deps:** Update dependencies. ([617d946](https://github.com/darkobits/nr/commit/617d946245aea3a218df999229fbf38b5676c02e))

## [0.17.1](https://github.com/darkobits/nr/compare/v0.17.0...v0.17.1) (2024-03-12)


### 🏗 Chores

* **deps:** Update dependencies. ([17ede77](https://github.com/darkobits/nr/commit/17ede77788cbd8a915c838753a29d36a0f46c350))


### 📖 Documentation

* Update README. ([7e7a814](https://github.com/darkobits/nr/commit/7e7a814859e3c717e4be722d1e69a97b8de4e460))


### 🛠 Refactoring

* Command thunks return execa results. ([36e79ec](https://github.com/darkobits/nr/commit/36e79ecd2fe31ef800a98f870009c9ef9829b806))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.17.0](https://github.com/darkobits/nr/compare/v0.17.0-beta.5...v0.17.0) (2024-02-01)

## [0.17.0-beta.5](https://github.com/darkobits/nr/compare/v0.17.0-beta.4...v0.17.0-beta.5) (2024-02-01)


### ✨ Features

* Allow primitives in command arguments. ([5a3e848](https://github.com/darkobits/nr/commit/5a3e8486f2aed232b4b1b149ace0b433cf5a8f91))


### 🏗 Chores

* **deps:** Update dependencies. ([81194ca](https://github.com/darkobits/nr/commit/81194caab664bd3f540bb2c6728b2b2886e1ddef))


### 📖 Documentation

* Update README. ([dd154e6](https://github.com/darkobits/nr/commit/dd154e689c0aaa8999f98ab454c93ce1f88863b5))
* Update README. ([b42bbec](https://github.com/darkobits/nr/commit/b42bbec39159a38eb52497c2942d5383c04151de))


### 🛠 Refactoring

* Rename tasks to functions. ([ac9eaf8](https://github.com/darkobits/nr/commit/ac9eaf8efa9dafce3139dd50e4dc114d629608f3))

## [0.17.0-beta.4](https://github.com/darkobits/nr/compare/v0.17.0-beta.2...v0.17.0-beta.4) (2024-01-12)


### ⚠ BREAKING CHANGES

* `is-ci` is no longer passed to user configuration functions. This dependency may be installed by the user if needed.

### ✨ Features

* `defineConfig` handles arrays. ([1fb6276](https://github.com/darkobits/nr/commit/1fb6276c59d6f5d75812acc7f47d7ed96473308f))


### 🏗 Chores

* **deps:** Update dependencies. ([6c36d15](https://github.com/darkobits/nr/commit/6c36d15bbb3c13fae758c9c714f7db8ebc5522bc))
* Fix errors in `package.json`. ([dd12a37](https://github.com/darkobits/nr/commit/dd12a371bc4b284657841d31067311310d65a2d1))
* Misc. refactoring. ([7fa40d3](https://github.com/darkobits/nr/commit/7fa40d3ebdf9d2ec2476ab6b3ea8530f4511fc35))
* **release:** 0.17.0-beta.2 ([669db51](https://github.com/darkobits/nr/commit/669db514bf6e34894bf67b8e7fd05037f289893c))
* **release:** 0.17.0-beta.3 ([7d1c6a5](https://github.com/darkobits/nr/commit/7d1c6a5126259544e43e5e49ec7fd986bd6380ec))


### 📖 Documentation

* Update `README`. ([3896c17](https://github.com/darkobits/nr/commit/3896c1738ca81803c0299dfa3d94c5861cbd8235))
* Update README. ([fa249ce](https://github.com/darkobits/nr/commit/fa249ce115913354847389140e26a064d6a9d619))


### 🛠 Refactoring

* Remove `is-ci`. ([bbf224f](https://github.com/darkobits/nr/commit/bbf224f9c60a5bfe27c7d9c9cd33e1b83d064442))

## [0.17.0-beta.2](https://github.com/darkobits/nr/compare/v0.17.0-beta.1...v0.17.0-beta.2) (2024-01-11)


### ✨ Features

* `defineConfig` handles arrays. ([1fb6276](https://github.com/darkobits/nr/commit/1fb6276c59d6f5d75812acc7f47d7ed96473308f))


### 🏗 Chores

* Fix errors in `package.json`. ([dd12a37](https://github.com/darkobits/nr/commit/dd12a371bc4b284657841d31067311310d65a2d1))
* **release:** 0.17.0-beta.2 ([669db51](https://github.com/darkobits/nr/commit/669db514bf6e34894bf67b8e7fd05037f289893c))
* **release:** 0.17.0-beta.3 ([b38dd60](https://github.com/darkobits/nr/commit/b38dd6021a785f9659400a8ba3b3e2ca1f4f0ba8))


### 📖 Documentation

* Update `README`. ([3896c17](https://github.com/darkobits/nr/commit/3896c1738ca81803c0299dfa3d94c5861cbd8235))
* Update README. ([6288329](https://github.com/darkobits/nr/commit/6288329251d8ac516e0ec8373594471d29d7ca9d))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.17.0-beta.3](https://github.com/darkobits/nr/compare/v0.17.0-beta.2...v0.17.0-beta.3) (2024-01-08)


### 🏗 Chores

* Fix errors in `package.json`. ([dd12a37](https://github.com/darkobits/nr/commit/dd12a371bc4b284657841d31067311310d65a2d1))


### 📖 Documentation

* Update `README`. ([3896c17](https://github.com/darkobits/nr/commit/3896c1738ca81803c0299dfa3d94c5861cbd8235))

## [0.17.0-beta.2](https://github.com/darkobits/nr/compare/v0.17.0-beta.1...v0.17.0-beta.2) (2024-01-08)


### ✨ Features

* `defineConfig` handles arrays. ([1fb6276](https://github.com/darkobits/nr/commit/1fb6276c59d6f5d75812acc7f47d7ed96473308f))

## [0.17.0-beta.1](https://github.com/darkobits/nr/compare/v0.16.5...v0.17.0-beta.1) (2024-01-08)


### ✨ Features

* Configuration files may export arrays. ([06319d8](https://github.com/darkobits/nr/commit/06319d89a9bf3265f26f1df0a4b4a5f504fc2538))

## [0.16.5](https://github.com/darkobits/nr/compare/v0.16.4...v0.16.5) (2024-01-08)


### 🏗 Chores

* **deps:** Update dependencies. ([7d5c57c](https://github.com/darkobits/nr/commit/7d5c57cb89a0f44fb33f392b16e71ec112d40694))


### 📖 Documentation

* Update `README`. ([fbf4886](https://github.com/darkobits/nr/commit/fbf48863abc3a629b9ee29158b2d6dab729cd7cd))

## [0.16.4](https://github.com/darkobits/nr/compare/v0.16.3...v0.16.4) (2023-12-12)


### 🏗 Chores

* **deps:** Update dependencies. ([7dffce6](https://github.com/darkobits/nr/commit/7dffce6daa7162886bcd54b406220aa9c51f71a2))

## [0.16.3](https://github.com/darkobits/nr/compare/v0.16.2...v0.16.3) (2023-11-19)


### 🏗 Chores

* **deps:** Update dependencies. ([77c63ff](https://github.com/darkobits/nr/commit/77c63ff10e7570ccae3dd4af11d5e13639b5c065))


### 🛠 Refactoring

* Remove types from various options. ([872f78c](https://github.com/darkobits/nr/commit/872f78c3f4564811508af5daf3f006e1f82f278b))

## [0.16.2](https://github.com/darkobits/nr/compare/v0.16.1...v0.16.2) (2023-07-12)


### 🏗 Chores

* **deps:** Update dependencies. ([c158333](https://github.com/darkobits/nr/commit/c1583338ced1860e5a77cd43657bf8f1d193a23b))

## [0.16.1](https://github.com/darkobits/nr/compare/v0.16.0...v0.16.1) (2023-07-10)


### 🏗 Chores

* **deps:** Update dependencies. ([3f876c7](https://github.com/darkobits/nr/commit/3f876c79b5f6cf9c36849d2bcdd1f27515d89ed5))

## [0.16.0](https://github.com/darkobits/nr/compare/v0.15.2...v0.16.0) (2023-07-06)


### ✨ Features

* Add `hidden` option for scripts. ([d2b3cba](https://github.com/darkobits/nr/commit/d2b3cba4004c1d6106ed41c94cdd9aecc22e2590))


### 🐞 Bug Fixes

* Remove `stdio` option if user provided custom IO options. ([b1af9c7](https://github.com/darkobits/nr/commit/b1af9c796150c9536b22b3e3a2ce6d6179c3a943))


### 🏗 Chores

* **deps:** Update dependencies. ([82ac174](https://github.com/darkobits/nr/commit/82ac174bee68d261778cd41e33cce08b3f43b4a3))

## [0.15.2](https://github.com/darkobits/nr/compare/v0.15.1...v0.15.2) (2023-07-06)


### 🐞 Bug Fixes

* Add export map for `package.json`. ([f90023a](https://github.com/darkobits/nr/commit/f90023add332183e272a1bc1904d5dd0ac236e37))

## [0.15.1](https://github.com/darkobits/nr/compare/v0.15.0...v0.15.1) (2023-07-04)


### 🏗 Chores

* **deps:** Update dependencies. ([b1c0138](https://github.com/darkobits/nr/commit/b1c0138e7969cbd6261e5d77fce275e260a4a4ae))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.15.0](https://github.com/darkobits/nr/compare/v0.14.17...v0.15.0) (2023-07-04)


### 🏗 Chores

* **release:** 0.14.47 ([644613c](https://github.com/darkobits/nr/commit/644613c1bc14e570b0f32c382b8cb5733b1b86b6))


### 📖 Documentation

* Update README. ([94ce80c](https://github.com/darkobits/nr/commit/94ce80cc74d3624a2c4ab09bc7a304465d00a621))


### 🛠 Refactoring

* Rename `ConfigurationFactory` to `UserConfigurationFn`. ([a7b4a5c](https://github.com/darkobits/nr/commit/a7b4a5c8f5c2b842377a3648cb67b2a06b98333a))

## [0.14.47](https://github.com/darkobits/nr/compare/v0.14.46...v0.14.47) (2023-07-04)


### 🏗 Chores

* **deps:** Update dependencies. ([74ef24e](https://github.com/darkobits/nr/commit/74ef24eee185c2ca8f9ccc8be69183d9727e4ef1))
* Parallelize smoke tests. ([a448c6f](https://github.com/darkobits/nr/commit/a448c6f8f11133c12aefce975566d0c6ed711d11))
* Re-enable smoke tests. ([9d9fb7e](https://github.com/darkobits/nr/commit/9d9fb7ef93cbbf3628f8fcedb2be24c16b993f16))
* **release:** 0.14.47 ([eedd7f8](https://github.com/darkobits/nr/commit/eedd7f8d4402170fbdbd5228fb50592dffa0edf0))
* **release:** 0.14.47 ([d529b70](https://github.com/darkobits/nr/commit/d529b7025eeb11430a795ba94a7f3f4e6b4aa111))
* Reorganize tests. ([d64601d](https://github.com/darkobits/nr/commit/d64601d2383db6619966f561e87ba0b3b0d70618))


### 📖 Documentation

* Update README. ([94ce80c](https://github.com/darkobits/nr/commit/94ce80cc74d3624a2c4ab09bc7a304465d00a621))
* Update README. ([29fa2fc](https://github.com/darkobits/nr/commit/29fa2fcb8cc2211b62262c1d75f5c80388eef489))
* Update README. ([549addc](https://github.com/darkobits/nr/commit/549addc488ce3a61f5097368335d6523d083217d))


### 🛠 Refactoring

* Misc. cleanup. ([2f25c83](https://github.com/darkobits/nr/commit/2f25c839298fa29f043c3807eb715c688afdcba3))
* Rename `ConfigurationFactory` to `UserConfigurationFn`. ([a7b4a5c](https://github.com/darkobits/nr/commit/a7b4a5c8f5c2b842377a3648cb67b2a06b98333a))

## [0.14.47](https://github.com/darkobits/nr/compare/v0.14.46...v0.14.47) (2023-07-03)


### 🏗 Chores

* **deps:** Update dependencies. ([74ef24e](https://github.com/darkobits/nr/commit/74ef24eee185c2ca8f9ccc8be69183d9727e4ef1))
* Parallelize smoke tests. ([a448c6f](https://github.com/darkobits/nr/commit/a448c6f8f11133c12aefce975566d0c6ed711d11))
* Re-enable smoke tests. ([9d9fb7e](https://github.com/darkobits/nr/commit/9d9fb7ef93cbbf3628f8fcedb2be24c16b993f16))
* **release:** 0.14.47 ([d529b70](https://github.com/darkobits/nr/commit/d529b7025eeb11430a795ba94a7f3f4e6b4aa111))
* Reorganize tests. ([d64601d](https://github.com/darkobits/nr/commit/d64601d2383db6619966f561e87ba0b3b0d70618))


### 📖 Documentation

* Update README. ([29fa2fc](https://github.com/darkobits/nr/commit/29fa2fcb8cc2211b62262c1d75f5c80388eef489))
* Update README. ([549addc](https://github.com/darkobits/nr/commit/549addc488ce3a61f5097368335d6523d083217d))


### 🛠 Refactoring

* Misc. cleanup. ([2f25c83](https://github.com/darkobits/nr/commit/2f25c839298fa29f043c3807eb715c688afdcba3))

## [0.14.47](https://github.com/darkobits/nr/compare/v0.14.46...v0.14.47) (2023-06-30)


### 🏗 Chores

* Parallelize smoke tests. ([a448c6f](https://github.com/darkobits/nr/commit/a448c6f8f11133c12aefce975566d0c6ed711d11))


### 📖 Documentation

* Update README. ([549addc](https://github.com/darkobits/nr/commit/549addc488ce3a61f5097368335d6523d083217d))

## [0.14.46](https://github.com/darkobits/nr/compare/v0.14.45...v0.14.46) (2023-06-30)


### ⚠ BREAKING CHANGES

* - Script's instructions now filter-out falsy values automatically.
- Commands, tasks, and scripts can now accept single instructions.
- Major API refactoring. See docs.

### 🏗 Chores

* **deps:** Update dependencies. ([8db86dc](https://github.com/darkobits/nr/commit/8db86dcaf8fae36e47a273fe3f5f74782c88b273))
* **deps:** Update dependencies. ([870f6ca](https://github.com/darkobits/nr/commit/870f6ca705b7cfd14f825251a230cfec20f1efe4))
* **deps:** Update dependencies. ([e032396](https://github.com/darkobits/nr/commit/e032396e99787cda93c09f32ce4b6bcd9faee8f7))
* Misc cleanup. ([ea02900](https://github.com/darkobits/nr/commit/ea0290010e36b99b756ea550b16e23c7c05d7274))
* **release:** 0.14.46 ([d6019a2](https://github.com/darkobits/nr/commit/d6019a2e50af5b2b674fd4ee80f14d5ae394086f))
* **release:** 0.14.46-beta.1 ([bd12b39](https://github.com/darkobits/nr/commit/bd12b3925e6f841e697ce09444fb768bf44ec656))
* **release:** 0.14.46-beta.2 ([5083553](https://github.com/darkobits/nr/commit/5083553edf79628f557cda02cfedc1f26aac90ac))


### 📖 Documentation

* Update README. ([567dffb](https://github.com/darkobits/nr/commit/567dffb78f63bbb9d08df9837184660f3dac7f79))


### 🛠 Refactoring

* Move script name to first argument. ([81b8b63](https://github.com/darkobits/nr/commit/81b8b6348831562fbad0f994d63cca34c8ac8fea))
* Refactor API, add various improvements. ([0efbd0b](https://github.com/darkobits/nr/commit/0efbd0b73df83c7280ae81c3efff69a127d6eab0))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.14.46](https://github.com/darkobits/nr/compare/v0.14.46-beta.2...v0.14.46) (2023-06-30)


### 🏗 Chores

* **deps:** Update dependencies. ([870f6ca](https://github.com/darkobits/nr/commit/870f6ca705b7cfd14f825251a230cfec20f1efe4))

## [0.14.46-beta.2](https://github.com/darkobits/nr/compare/v0.14.46-beta.1...v0.14.46-beta.2) (2023-06-29)


### 🏗 Chores

* **deps:** Update dependencies. ([e032396](https://github.com/darkobits/nr/commit/e032396e99787cda93c09f32ce4b6bcd9faee8f7))


### 🛠 Refactoring

* Move script name to first argument. ([81b8b63](https://github.com/darkobits/nr/commit/81b8b6348831562fbad0f994d63cca34c8ac8fea))

## [0.14.46-beta.1](https://github.com/darkobits/nr/compare/v0.14.45...v0.14.46-beta.1) (2023-06-29)


### ⚠ BREAKING CHANGES

* - Script's instructions now filter-out falsy values automatically.
- Commands, tasks, and scripts can now accept single instructions.
- Major API refactoring. See docs.

### 📖 Documentation

* Update README. ([567dffb](https://github.com/darkobits/nr/commit/567dffb78f63bbb9d08df9837184660f3dac7f79))


### 🛠 Refactoring

* Refactor API, add various improvements. ([0efbd0b](https://github.com/darkobits/nr/commit/0efbd0b73df83c7280ae81c3efff69a127d6eab0))

## [0.14.45](https://github.com/darkobits/nr/compare/v0.14.44...v0.14.45) (2023-06-28)


### 🏗 Chores

* **deps:** Update dependencies. ([782d61d](https://github.com/darkobits/nr/commit/782d61d87b3109aeb54e54f61b3640917d572031))


### 🛠 Refactoring

* Various UI improvements. ([e941b7e](https://github.com/darkobits/nr/commit/e941b7e2eec0fe656c3090a1a41f0724837be897))

## [0.14.44](https://github.com/darkobits/nr/compare/v0.14.43...v0.14.44) (2023-06-28)


### 🐞 Bug Fixes

* Show/hide script origin descriptors correctly. ([3021ec9](https://github.com/darkobits/nr/commit/3021ec9eaf82117002068e46557c25aebc927c28))


### 🏗 Chores

* **tests:** Update smoke test logging. ([d59a49d](https://github.com/darkobits/nr/commit/d59a49d369a6a3f695a9922bc16543d80c430949))


### 🛠 Refactoring

* Refactor logging. ([0dd88b1](https://github.com/darkobits/nr/commit/0dd88b19832c920fcf0098d8f0a38be3d00ef880))

## [0.14.43](https://github.com/darkobits/nr/compare/v0.14.42...v0.14.43) (2023-06-27)


### 🛠 Refactoring

* Move logging to script thunks. ([3b335a5](https://github.com/darkobits/nr/commit/3b335a535038bf7fb7fd6b04f7b83361cbc56fa9))

## [0.14.42](https://github.com/darkobits/nr/compare/v0.14.41...v0.14.42) (2023-06-27)


### 🛠 Refactoring

* Improve logging. ([01def65](https://github.com/darkobits/nr/commit/01def65b2e41f11f503cbedbbb44104a20d3295f))

## [0.14.41](https://github.com/darkobits/nr/compare/v0.14.40...v0.14.41) (2023-06-27)


### 🏗 Chores

* **deps:** Update dependencies. ([437143d](https://github.com/darkobits/nr/commit/437143dc239df69703f13ae834784b10b5236869))
* Update linting rules. ([6a9912c](https://github.com/darkobits/nr/commit/6a9912cfcd87e10d92ab193bf5a12e85571e2098))
* Update package scripts. ([ebc5e1c](https://github.com/darkobits/nr/commit/ebc5e1ce9b7b1c67f67426b221ac389d37c2056c))


### 🛠 Refactoring

* Improve script info logging. ([528ef3c](https://github.com/darkobits/nr/commit/528ef3c014608bfd29a7134d9a912413fee1f19b))

## [0.14.40](https://github.com/darkobits/nr/compare/v0.14.39...v0.14.40) (2023-06-26)


### 🏗 Chores

* **deps:** Update `ow`. ([bb5fddf](https://github.com/darkobits/nr/commit/bb5fddfc904c9355c6a86454f1f70bf4910a7a9b))
* **deps:** Update dependencies. ([ad6a0bf](https://github.com/darkobits/nr/commit/ad6a0bfe314054bf6b0cf0837cea8973abdf86f2))
* **deps:** Update dependencies. ([c9c2fda](https://github.com/darkobits/nr/commit/c9c2fdae8dca6c00246679f6dd15d89a894ebbc2))
* **deps:** Update dependencies. ([97a77f4](https://github.com/darkobits/nr/commit/97a77f4651ec26c4e65781fe398400b64ec90f36))
* **deps:** Update dependencies. ([9905bcc](https://github.com/darkobits/nr/commit/9905bcc9f5453b203e4c05fd0ed0c4488197612f))
* **deps:** Update dependencies. ([14f5124](https://github.com/darkobits/nr/commit/14f5124a740981d8428547fa78f1feeae792dbfd))
* **release:** 0.14.40-beta.1 ([804ed01](https://github.com/darkobits/nr/commit/804ed016c31ea5f8c0ac1d932e2ed4319c04c0ac))
* **release:** 0.14.40-beta.2 ([d26551b](https://github.com/darkobits/nr/commit/d26551b6c0fb11f3815698137a47f5e0ee74d0fe))
* **release:** 0.14.40-beta.3 ([6d1b039](https://github.com/darkobits/nr/commit/6d1b0394736220c534b64e731610ba50626812b0))
* **release:** 0.14.40-beta.4 ([424ed2b](https://github.com/darkobits/nr/commit/424ed2b88b7fd4ab78c22e1f8a2a2a45e294a3a2))


### 🛠 Refactoring

* Publish as ESM. ([5f56d4a](https://github.com/darkobits/nr/commit/5f56d4a6f327d905896153b394b008a372e5ffbb))
* Update script info logging. ([1454f56](https://github.com/darkobits/nr/commit/1454f5648d8260bb5a076b0d4d40dec823043dec))

## [0.14.40-beta.4](https://github.com/darkobits/nr/compare/v0.14.40-beta.3...v0.14.40-beta.4) (2023-06-25)


### 🏗 Chores

* **deps:** Update dependencies. ([c9c2fda](https://github.com/darkobits/nr/commit/c9c2fdae8dca6c00246679f6dd15d89a894ebbc2))

## [0.14.40-beta.3](https://github.com/darkobits/nr/compare/v0.14.40-beta.2...v0.14.40-beta.3) (2023-06-25)


### 🛠 Refactoring

* Update script info logging. ([1454f56](https://github.com/darkobits/nr/commit/1454f5648d8260bb5a076b0d4d40dec823043dec))

## [0.14.40-beta.2](https://github.com/darkobits/nr/compare/v0.14.40-beta.1...v0.14.40-beta.2) (2023-06-25)


### 🏗 Chores

* **deps:** Update `ow`. ([bb5fddf](https://github.com/darkobits/nr/commit/bb5fddfc904c9355c6a86454f1f70bf4910a7a9b))
* **deps:** Update dependencies. ([97a77f4](https://github.com/darkobits/nr/commit/97a77f4651ec26c4e65781fe398400b64ec90f36))
* **deps:** Update dependencies. ([9905bcc](https://github.com/darkobits/nr/commit/9905bcc9f5453b203e4c05fd0ed0c4488197612f))
* **deps:** Update dependencies. ([14f5124](https://github.com/darkobits/nr/commit/14f5124a740981d8428547fa78f1feeae792dbfd))

## [0.14.40-beta.1](https://github.com/darkobits/nr/compare/v0.14.39...v0.14.40-beta.1) (2023-06-22)


### 🛠 Refactoring

* Publish as ESM. ([5f56d4a](https://github.com/darkobits/nr/commit/5f56d4a6f327d905896153b394b008a372e5ffbb))

## [0.14.39](https://github.com/darkobits/nr/compare/v0.14.38...v0.14.39) (2023-06-14)


### 🛠 Refactoring

* Update `cli.ts`. ([2412472](https://github.com/darkobits/nr/commit/24124728c63c074957f37dc0918a23889bebc034))

## [0.14.38](https://github.com/darkobits/nr/compare/v0.14.37...v0.14.38) (2023-06-14)


### 🏗 Chores

* **deps:** Update dependencies. ([a737124](https://github.com/darkobits/nr/commit/a73712450c240fceb0cde00fa6401b5bc04f0d20))

## [0.14.37](https://github.com/darkobits/nr/compare/v0.14.36...v0.14.37) (2023-06-11)


### 📖 Documentation

* Update README. ([6348df4](https://github.com/darkobits/nr/commit/6348df4ed1490fa5fcfe98190b552a9a3274d262))


### 🏗 Chores

* **deps:** Update dependencies. ([6f48c02](https://github.com/darkobits/nr/commit/6f48c02fd9faffadd2e1b9e22b7022c2d13bef06))

## [0.14.36](https://github.com/darkobits/nr/compare/v0.14.35...v0.14.36) (2023-06-10)


### 🐞 Bug Fixes

* Use dynamic import for `node-emoji`. ([c8c737a](https://github.com/darkobits/nr/commit/c8c737a4ec82591520f1c5d9d9706fc43fc06291))


### 📖 Documentation

* Update README. ([6df30e1](https://github.com/darkobits/nr/commit/6df30e1552bada8d35983023bfe0b5086218b124))


### 🏗 Chores

* **deps:** Update dependencies. ([a9852a5](https://github.com/darkobits/nr/commit/a9852a5d49b17251d474356e5a91c55fa79b84d8))
* **release:** 0.14.36-beta.1 ([912197e](https://github.com/darkobits/nr/commit/912197e1bf86e359c9ac553faa8dd1207c446734))
* Update LICENSE. ([8ad5190](https://github.com/darkobits/nr/commit/8ad5190a1eaeb6ffc46dd890cc66aed54a60c16a))

## [0.14.36-beta.1](https://github.com/darkobits/nr/compare/v0.14.35...v0.14.36-beta.1) (2023-06-03)


### 🏗 Chores

* **deps:** Update dependencies. ([a9852a5](https://github.com/darkobits/nr/commit/a9852a5d49b17251d474356e5a91c55fa79b84d8))


### 🐞 Bug Fixes

* Use dynamic import for `node-emoji`. ([c8c737a](https://github.com/darkobits/nr/commit/c8c737a4ec82591520f1c5d9d9706fc43fc06291))

## [0.14.35](https://github.com/darkobits/nr/compare/v0.14.34...v0.14.35) (2023-02-23)


### 🛠 Refactoring

* Re-enable `ow`. ([e094fc5](https://github.com/darkobits/nr/commit/e094fc514bc97419948b7ddb17ed0f359ca78d00))


### 📖 Documentation

* Update README. ([1786722](https://github.com/darkobits/nr/commit/17867222df03916db0c8a42873be9ce29f05deb4))
* Update README. ([1b7b7c6](https://github.com/darkobits/nr/commit/1b7b7c67bbacb78c1ea4e8edac9f03ddd3df6dfd))


### 🏗 Chores

* **deps:** Update dependencies. ([0499969](https://github.com/darkobits/nr/commit/0499969cc7c2ed4fce06a64cce47d7f58c74840e))
* **release:** 0.14.35-beta.1 ([b51b3f0](https://github.com/darkobits/nr/commit/b51b3f0e1087de4472dc8475cc9b772c163fc1ab))

## [0.14.35-beta.1](https://github.com/darkobits/nr/compare/v0.14.34...v0.14.35-beta.1) (2023-02-23)


### 📖 Documentation

* Update README. ([d7d6b49](https://github.com/darkobits/nr/commit/d7d6b491a1edfaf3ceb1e4151d7fb5d4b2a2111a))


### 🛠 Refactoring

* Re-enable `ow`. ([a9b2e45](https://github.com/darkobits/nr/commit/a9b2e451c8c42cf7d44468d8d236b6a3e85fa781))

## [0.14.34](https://github.com/darkobits/nr/compare/v0.14.33...v0.14.34) (2023-02-15)


### 🏗 Chores

* **deps:** Update dependencies. ([a82b4c9](https://github.com/darkobits/nr/commit/a82b4c997261578f9496d9435ab76dc5470a90e8))
* Run fixtures locally after builds. ([7676836](https://github.com/darkobits/nr/commit/7676836683f80f3c360b7171f09043e69825395e))

## [0.14.33](https://github.com/darkobits/nr/compare/v0.14.32...v0.14.33) (2023-02-15)


### 🏗 Chores

* **deps:** Update dependencies. ([2a29a34](https://github.com/darkobits/nr/commit/2a29a34176a0583d505353c3747aa3f6428dbcd1))


### 🛠 Refactoring

* Revert to publishing as CommonJS. ([e2b9b6b](https://github.com/darkobits/nr/commit/e2b9b6b2a447d67b78f517bc34bbb6b4e01409eb))

## [0.14.32](https://github.com/darkobits/nr/compare/v0.14.31...v0.14.32) (2023-02-14)


### 🛠 Refactoring

* Improve script source reporting. ([6b79b2d](https://github.com/darkobits/nr/commit/6b79b2d2b95ef749ddf3149d68e872e93731c24c))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.14.31](https://github.com/darkobits/nr/compare/v0.14.31-beta.4...v0.14.31) (2023-02-14)

## [0.14.31-beta.4](https://github.com/darkobits/nr/compare/v0.14.31-beta.3...v0.14.31-beta.4) (2023-02-14)


### 🏗 Chores

* **deps:** Update dependencies. ([97b3c06](https://github.com/darkobits/nr/commit/97b3c06aa31c90adb4577c2602b0bf19bebc0042))

## [0.14.31-beta.3](https://github.com/darkobits/nr/compare/v0.14.31-beta.2...v0.14.31-beta.3) (2023-02-14)


### 🏗 Chores

* **deps:** Update dependencies. ([894ce2b](https://github.com/darkobits/nr/commit/894ce2b55d5a254663a45c4ea743052ab44effb1))

## [0.14.31-beta.2](https://github.com/darkobits/nr/compare/v0.14.31-beta.1...v0.14.31-beta.2) (2023-02-14)


### 🏗 Chores

* **deps:** Update dependencies. ([dec49e4](https://github.com/darkobits/nr/commit/dec49e461536ba6e07c747423b2ca6b7933b4a17))


### 🛠 Refactoring

* Publish as ESM. ([e067854](https://github.com/darkobits/nr/commit/e067854f7576677cbd647578b08c997e9a4e36e2))

## [0.14.31-beta.1](https://github.com/darkobits/nr/compare/v0.14.30...v0.14.31-beta.1) (2023-02-14)


### 🛠 Refactoring

* Build with Vite. ([95b9e9d](https://github.com/darkobits/nr/commit/95b9e9d9e71718a1e6a7e3bc0e11db63f8ca4d0f))

## [0.14.30](https://github.com/darkobits/nr/compare/v0.14.29...v0.14.30) (2023-02-14)


### 🐞 Bug Fixes

* Do not invoke `resolveCommand` for Node commands. ([cbe160a](https://github.com/darkobits/nr/commit/cbe160a59c01606726cb095788f151c4db4acfff))

## [0.14.29](https://github.com/darkobits/nr/compare/v0.14.28...v0.14.29) (2023-01-30)


### 🏗 Chores

* **deps:** Update dependencies. ([2c8db27](https://github.com/darkobits/nr/commit/2c8db27719c7031546187408a4cf3ecdec0880d3))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.14.28](https://github.com/darkobits/nr/compare/v0.14.27...v0.14.28) (2023-01-29)


### 🏗 Chores

* **deps:** Update dependencies. ([9d23fae](https://github.com/darkobits/nr/commit/9d23faedf4a732b9e42917a965adeac39ba078ab))


### 🐞 Bug Fixes

* Remove `node:` prefixes for built-ins. ([9e1216c](https://github.com/darkobits/nr/commit/9e1216c5355db41805195f8f33a4ae94c00ecf9f))

## [0.14.27](https://github.com/darkobits/nr/compare/v0.14.27-beta.0...v0.14.27) (2023-01-29)


### 🏗 Chores

* **deps:** Update dependencies. ([0b9800e](https://github.com/darkobits/nr/commit/0b9800ead37cba8e3469d08c7d58a0d2ced82a55))

## [0.14.27-beta.0](https://github.com/darkobits/nr/compare/v0.14.26...v0.14.27-beta.0) (2023-01-29)


### 🛠 Refactoring

* Resolve instructions when scripts are executed rather than defined. ([31d093a](https://github.com/darkobits/nr/commit/31d093ac93102a74aa805a197f00a1a58e41cc08))


### 🏗 Chores

* **deps:** Update dependencies. ([dfc43b8](https://github.com/darkobits/nr/commit/dfc43b8f6ebad62309d79b0074ec06beea03dbd7))

## [0.14.26](https://github.com/darkobits/nr/compare/v0.14.25...v0.14.26) (2023-01-28)


### 🏗 Chores

* **deps:** Update dependencies. ([f2fa997](https://github.com/darkobits/nr/commit/f2fa997dffcedc14f753e481034c8677d21ecc9d))


### 📖 Documentation

* Update README. ([7dec1ed](https://github.com/darkobits/nr/commit/7dec1ed2f2ff11f9fe0f7163db823e840efb1e84))

## [0.14.25](https://github.com/darkobits/nr/compare/v0.14.24...v0.14.25) (2023-01-28)


### 🏗 Chores

* **deps:** Update dependencies. ([267b3d1](https://github.com/darkobits/nr/commit/267b3d1799a0ed339e709dec117d173be6cdca72))


### 🐞 Bug Fixes

* **scripts:** Report script timing for sub-scripts. ([24c7958](https://github.com/darkobits/nr/commit/24c7958c26197405a6d1c1ace74024574c3dddf2))

## [0.14.24](https://github.com/darkobits/nr/compare/v0.14.23...v0.14.24) (2023-01-25)


### 🛠 Refactoring

* Remove `command.babel`. ([8735860](https://github.com/darkobits/nr/commit/873586091605ed5af0d1042765c38032708ce81e))


### 🏗 Chores

* **deps:** Update dependencies. ([d2ecfd5](https://github.com/darkobits/nr/commit/d2ecfd5482d0911c71a948241798fbc89381f19d))

## [0.14.23](https://github.com/darkobits/nr/compare/v0.14.22...v0.14.23) (2023-01-25)


### 🏗 Chores

* **deps:** Update dependencies. ([781042d](https://github.com/darkobits/nr/commit/781042d505bf58ab537ed7eb2d5394d30e4fa213))

## [0.14.22](https://github.com/darkobits/nr/compare/v0.14.21...v0.14.22) (2023-01-25)


### 🐞 Bug Fixes

* **scripts:** Lookup `pre` and `post` scripts correctly. ([d457422](https://github.com/darkobits/nr/commit/d4574226cb6fac01afef65c76d62ae143eef6e71))

## [0.14.21](https://github.com/darkobits/nr/compare/v0.14.20...v0.14.21) (2023-01-25)


### 🏗 Chores

* **deps:** Update dependencies. ([21a7ac0](https://github.com/darkobits/nr/commit/21a7ac05ae88d276d3a25a680c18661c57b9678a))

## [0.14.20](https://github.com/darkobits/nr/compare/v0.14.19...v0.14.20) (2023-01-25)


### 🏗 Chores

* **deps:** Update dependencies. ([507944e](https://github.com/darkobits/nr/commit/507944e9b01012d1bb2db3c142821d2846b1066e))

## [0.14.19](https://github.com/darkobits/nr/compare/v0.14.18...v0.14.19) (2023-01-25)


### 🏗 Chores

* **deps:** Update dependencies. ([15ae2e4](https://github.com/darkobits/nr/commit/15ae2e4eebc51a0f9905c0bd395eb7eed3986d3c))

## [0.14.18](https://github.com/darkobits/nr/compare/v0.14.17...v0.14.18) (2023-01-25)


### 🏗 Chores

* **deps:** Update dependencies. ([62e3f0a](https://github.com/darkobits/nr/commit/62e3f0ab80b3f143e2c99174ba665ca4af07370e))

## [0.14.17](https://github.com/darkobits/nr/compare/v0.14.16...v0.14.17) (2023-01-25)


### 🛠 Refactoring

* Publish as CommonJS. ([200e741](https://github.com/darkobits/nr/commit/200e7417cce030b245ee018996ea94c2af378b2b))

## [0.14.16](https://github.com/darkobits/nr/compare/v0.14.15...v0.14.16) (2023-01-25)


### 📖 Documentation

* Update README. ([5b7d694](https://github.com/darkobits/nr/commit/5b7d6944bec72f7c087093c00e8c8c6c656c2476))


### 🐞 Bug Fixes

* **scripts:** Ensure `pre` and `post` scripts are run for nested script calls. ([b0ba8ad](https://github.com/darkobits/nr/commit/b0ba8ad2b789538ffaca161ef170c747585b91f7))

## [0.14.15](https://github.com/darkobits/nr/compare/v0.14.14...v0.14.15) (2022-08-22)


### 🐞 Bug Fixes

* Dereference parallal instructions during script definition. ([223da80](https://github.com/darkobits/nr/commit/223da801f172eca2edd4aba37bba3ab653dd2ab3))


### 🏗 Chores

* **deps:** Update dependencies. ([34d80ac](https://github.com/darkobits/nr/commit/34d80accc742d61d3932c14cf3956bf0e8422b59))
* Trim whitespace in escaped commands. ([540d309](https://github.com/darkobits/nr/commit/540d309276f4caecba42c88406435e55584f3e61))

## [0.14.14](https://github.com/darkobits/nr/compare/v0.14.13...v0.14.14) (2022-08-21)


### 🐞 Bug Fixes

* Use correct type for `execaNode` options. ([655fb06](https://github.com/darkobits/nr/commit/655fb06c2f820eff2c7ad478463c8e0965ec47d6))

## [0.14.13](https://github.com/darkobits/nr/compare/v0.14.12...v0.14.13) (2022-08-21)


### 🛠 Refactoring

* Improve command, task logging. ([6524a97](https://github.com/darkobits/nr/commit/6524a97dd9e0bfe7872ba4323cdea9d92f1a0422))

## [0.14.12](https://github.com/darkobits/nr/compare/v0.14.11...v0.14.12) (2022-08-21)


### 🛠 Refactoring

* Improve script logging. ([0ed6513](https://github.com/darkobits/nr/commit/0ed6513b2eb3d703e2f5966d504dfcbd4023a425))

## [0.14.11](https://github.com/darkobits/nr/compare/v0.14.10...v0.14.11) (2022-08-21)


### 🐞 Bug Fixes

* Don't count unknown package sources. ([d1ac1e1](https://github.com/darkobits/nr/commit/d1ac1e1a6df06f8251df3f407c902210e8c5f1bf))

## [0.14.10](https://github.com/darkobits/nr/compare/v0.14.9...v0.14.10) (2022-08-21)


### 🏗 Chores

* Misc. cleanup. ([fba87bc](https://github.com/darkobits/nr/commit/fba87bcf004097d1f1d1b1cbee800cdf2c22e3cd))


### 🛠 Refactoring

* Disable `ow`. ([c3f7e17](https://github.com/darkobits/nr/commit/c3f7e17817602aa85090a6bd8af249d1b57093ae))

## [0.14.9](https://github.com/darkobits/nr/compare/v0.14.8...v0.14.9) (2022-08-21)


### 🐞 Bug Fixes

* `loadConfig` handles nested default exports. ([249c177](https://github.com/darkobits/nr/commit/249c17722475e43cc203207ff4cf57adb2cb037f))

## [0.14.8](https://github.com/darkobits/nr/compare/v0.14.7...v0.14.8) (2022-08-21)


### 🏗 Chores

* Add debug logging. ([249d085](https://github.com/darkobits/nr/commit/249d0856136777075ee0939c9ff302a92daec6e5))

## [0.14.7](https://github.com/darkobits/nr/compare/v0.14.6...v0.14.7) (2022-08-21)


### 🐞 Bug Fixes

* Fix `callsites` import. ([9108883](https://github.com/darkobits/nr/commit/910888384a5eae46fc9a5674cd8b35d4414d4c73))


### 🛠 Refactoring

* Refactor `resolveCommand`. ([9dee1c7](https://github.com/darkobits/nr/commit/9dee1c73828eeb0799c23a37f3200be553c6acf4))

## [0.14.6](https://github.com/darkobits/nr/compare/v0.14.5...v0.14.6) (2022-08-21)


### 🐞 Bug Fixes

* Don't use `npm-run-path` by default when resolving commands. ([2f54f29](https://github.com/darkobits/nr/commit/2f54f298d23f4575cc3ff975da424875cceabe42))

## [0.14.5](https://github.com/darkobits/nr/compare/v0.14.4...v0.14.5) (2022-08-21)


### 🐞 Bug Fixes

* **config:** Check for nested `default` property in configuration. ([7092723](https://github.com/darkobits/nr/commit/709272369a8bcf8cce8dd60b60a592c996db18a0))

## [0.14.4](https://github.com/darkobits/nr/compare/v0.14.3...v0.14.4) (2022-08-21)


### 🏗 Chores

* **deps:** Update dependencies. ([3abee7a](https://github.com/darkobits/nr/commit/3abee7a3a784563543b478d1b56ce873b88aa6d5))

## [0.14.3](https://github.com/darkobits/nr/compare/v0.14.2...v0.14.3) (2022-08-18)


### 🛠 Refactoring

* Reorganize types. ([27cc172](https://github.com/darkobits/nr/commit/27cc1725dab5957e6e48c083b1d859e73bd0f7c0))

## [0.14.2](https://github.com/darkobits/nr/compare/v0.14.1...v0.14.2) (2022-08-17)


### 🐞 Bug Fixes

* Wrap multi-line script descriptions correctly. ([706a56d](https://github.com/darkobits/nr/commit/706a56d180720650e3ca67006887b3973d658f66))


### 🛠 Refactoring

* Group introspection scripts in CLI help. ([b84fc54](https://github.com/darkobits/nr/commit/b84fc5414960d844cc4f8bfbc3b0f228a65197a8))


### 🏗 Chores

* **deps:** Update dependencies. ([11806fd](https://github.com/darkobits/nr/commit/11806fd471f61cb9dfff186076a2b622e4512d5d))

## [0.14.1](https://github.com/darkobits/nr/compare/v0.14.0...v0.14.1) (2022-08-14)


### 🏗 Chores

* Add `@babel/node` as a peer dependency. ([bb7b482](https://github.com/darkobits/nr/commit/bb7b482a01222811c86f0949983954066df1c5b9))


### 📖 Documentation

* Update README. ([04783a2](https://github.com/darkobits/nr/commit/04783a210d43aee48698c13bb3e020cf627ed70d))
* Update README. ([edb0d39](https://github.com/darkobits/nr/commit/edb0d394137bf99c0eb6e71a4f89c30e99207398))


### 🛠 Refactoring

* Miscellaneous cleanup. ([7b1df92](https://github.com/darkobits/nr/commit/7b1df92f730b907639ff8d906755209cc5d1d4c4))
* Rename types. ([a9ee37b](https://github.com/darkobits/nr/commit/a9ee37becd98068cf7e51850bf485740162b0f9d))

## [0.14.0](https://github.com/darkobits/nr/compare/v0.13.0...v0.14.0) (2022-08-14)


### ✨ Features

* Add `--commands`, `--tasks` CLI arguments. ([31d90d1](https://github.com/darkobits/nr/commit/31d90d1f5ab939d674ca28d779c308c739a93e98))


### 📖 Documentation

* Update README. ([772b607](https://github.com/darkobits/nr/commit/772b607d6c96ef333b471ef2157e449af076f169))

## [0.13.0](https://github.com/darkobits/nr/compare/v0.12.0...v0.13.0) (2022-08-14)


### ✨ Features

* Indicate scripts from third-party packages in `--scripts` output. ([dad1b93](https://github.com/darkobits/nr/commit/dad1b934129b2f432a7636bf0fec65fb4aa9cec7))


### 🏗 Chores

* Improve output of `--scripts`. ([d3d9ab7](https://github.com/darkobits/nr/commit/d3d9ab731f1127479780a9bf2db5464aea98d75f))
* Improve script name matching. ([91045c6](https://github.com/darkobits/nr/commit/91045c62fbe45dd051a3f00cb93d6317ad14e811))


### 📖 Documentation

* Update README. ([8c1fd15](https://github.com/darkobits/nr/commit/8c1fd15d320ced520273276fbaa7cde57d6a5ee3))
* Update README. ([3bbaddc](https://github.com/darkobits/nr/commit/3bbaddc739a881b6f4f261da3730e665732e7176))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.12.0](https://github.com/darkobits/nr/compare/v0.11.8...v0.12.0) (2022-08-12)


### 🏗 Chores

* Export all types. ([8f85e31](https://github.com/darkobits/nr/commit/8f85e31282785fc49922c4adddbcf35f6faeffb1))


### 🛠 Refactoring

* Require prefixes on string identifiers for instructions. ([067e430](https://github.com/darkobits/nr/commit/067e4303f8a2ea8e56f304d9ef8998c081bffec5))

### [0.11.8](https://github.com/darkobits/nr/compare/v0.11.7...v0.11.8) (2022-08-11)


### 🏗 Chores

* **deps:** Update dependencies. ([d49b157](https://github.com/darkobits/nr/commit/d49b15790ecccab49e3f959bf06f6016a0120627))

### [0.11.7](https://github.com/darkobits/nr/compare/v0.11.6...v0.11.7) (2022-08-11)


### 🐞 Bug Fixes

* **types:** Include task thunks in instructions. ([965da0a](https://github.com/darkobits/nr/commit/965da0a74cb2d1353292421445acb20436d241c3))

### [0.11.6](https://github.com/darkobits/nr/compare/v0.11.5...v0.11.6) (2022-08-11)


### 🐞 Bug Fixes

* Narrow types to `true` for Symbol checks. ([c601d53](https://github.com/darkobits/nr/commit/c601d530ea8539c7df8862ef0dda3989d3bfdad5))

### [0.11.5](https://github.com/darkobits/nr/compare/v0.11.4...v0.11.5) (2022-08-11)


### 🏗 Chores

* **deps:** Update dependencies. ([ccf94fd](https://github.com/darkobits/nr/commit/ccf94fdc17b142846c6626daaf23e31970a0debe))

### [0.11.4](https://github.com/darkobits/nr/compare/v0.11.3...v0.11.4) (2022-03-29)


### 🏗 Chores

* Update dependencies. ([f232c9d](https://github.com/darkobits/nr/commit/f232c9d33edcb79522d6757213072bb47212fd4f))

### [0.11.3](https://github.com/darkobits/nr/compare/v0.11.2...v0.11.3) (2022-03-29)


### 🏗 Chores

* Export additional types. ([9305511](https://github.com/darkobits/nr/commit/93055117bae6d9aee631b08c1601ac3c9adfeeb7))


### 📖 Documentation

* Update README. ([0ea8317](https://github.com/darkobits/nr/commit/0ea8317b0a35c041a6be9faf941c88b710b21797))

### [0.11.2](https://github.com/darkobits/nr/compare/v0.11.1...v0.11.2) (2022-03-29)


### 🏗 Chores

* Update dependencies. ([ce77a6d](https://github.com/darkobits/nr/commit/ce77a6d76786542160244251f61a5049f761b645))

### [0.11.1](https://github.com/darkobits/nr/compare/v0.11.0...v0.11.1) (2022-03-29)


### 🏗 Chores

* Export configuration type from root. ([c84f1cc](https://github.com/darkobits/nr/commit/c84f1cc71e32973565c812a14d9ccc84d1eb6736))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.11.0](https://github.com/darkobits/nr/compare/v0.10.1...v0.11.0) (2022-03-29)


### 🛠 Refactoring

* Make API more terse. ([6ea1085](https://github.com/darkobits/nr/commit/6ea1085162d1274410cfb1161a95ea35a83e125c))

### [0.10.1](https://github.com/darkobits/nr/compare/v0.10.0...v0.10.1) (2022-03-29)


### 🏗 Chores

* **deps:** Update dependencies. ([d77188b](https://github.com/darkobits/nr/commit/d77188bc61a0abcbb949a1c2350fe92bbfa44893))

## [0.10.0](https://github.com/darkobits/nr/compare/v0.9.0...v0.10.0) (2022-03-29)


### 🏗 Chores

* **deps:** Update dependencies. ([674d3d8](https://github.com/darkobits/nr/commit/674d3d87bc9ceb9fc571259818d5bb617e4e55da))


### ✨ Features

* Support typed configuration files. ([7101933](https://github.com/darkobits/nr/commit/7101933ff33c7a80893f11312198a235249c377a))

## [0.9.0](https://github.com/darkobits/nr/compare/v0.8.19...v0.9.0) (2022-03-28)


### 🏗 Chores

* **deps:** Update dependencies. ([a0a4676](https://github.com/darkobits/nr/commit/a0a46768540db9fcdbba49ed54e3ec8311ae8398))


### ✨ Features

* Add support for task functions. ([0f37edf](https://github.com/darkobits/nr/commit/0f37edfc812f38c6429bb8dff92a54ac4d0c7bd3))

### [0.8.19](https://github.com/darkobits/nr/compare/v0.8.18...v0.8.19) (2022-03-25)


### 🐞 Bug Fixes

* Return empty array when no arguments are passed. ([e9b53c5](https://github.com/darkobits/nr/commit/e9b53c5aad8cad4053fefb3ecbafd337a57e9be3))


### 🏗 Chores

* **deps:** Update dependencies. ([a881dff](https://github.com/darkobits/nr/commit/a881dffa3e905a481d68c35107801a3755118c73))
* Release from CI. ([9f88575](https://github.com/darkobits/nr/commit/9f88575e8486de7d2b4dbedc0413029177fed394))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.8.18](https://github.com/darkobits/nr/compare/v0.8.17...v0.8.18) (2022-02-17)


### 🏗 Chores

* Simplify `resolveCommand`. ([c74ed0f](https://github.com/darkobits/nr/commit/c74ed0fc5b786cb852c8a169bfdb8a6449df4ad7))

### [0.8.17](https://github.com/darkobits/nr/compare/v0.8.16...v0.8.17) (2022-02-17)


### 🐞 Bug Fixes

* Use `npm-run-path` when resolving Node commands. ([96c6ff5](https://github.com/darkobits/nr/commit/96c6ff52d3b085e00a7cd9feaa0811bc124e536e))

### [0.8.16](https://github.com/darkobits/nr/compare/v0.8.15...v0.8.16) (2022-02-17)


### 🐞 Bug Fixes

* Resolve Node commands using `execaOptions.cwd`. ([f588deb](https://github.com/darkobits/nr/commit/f588deb6b717b41e1e0c87cb089a1b6aa6623fcf))

### [0.8.15](https://github.com/darkobits/nr/compare/v0.8.14...v0.8.15) (2022-02-17)

### [0.8.14](https://github.com/darkobits/nr/compare/v0.8.13...v0.8.14) (2022-02-17)


### 🏗 Chores

* Update dependencies. ([9e4c69f](https://github.com/darkobits/nr/commit/9e4c69f442623613ecc3f03cc07922f9b3d1e2f9))
* Update tests. ([41e1b10](https://github.com/darkobits/nr/commit/41e1b103d31bb763202f9cd1e0ad08f6432b0516))


### 🐞 Bug Fixes

* Do not resolve Node commands. ([165314d](https://github.com/darkobits/nr/commit/165314daeb26fca36b5ced83346b2cf858533f73))

### [0.8.13](https://github.com/darkobits/nr/compare/v0.8.12...v0.8.13) (2022-02-10)


### 🏗 Chores

* Update dependencies. ([c7a3ef8](https://github.com/darkobits/nr/commit/c7a3ef841c13885ccbd4f0885fc43c6ef40e4887))

### [0.8.12](https://github.com/darkobits/nr/compare/v0.8.11...v0.8.12) (2022-02-10)


### 🏗 Chores

* Update dependencies. ([f867b10](https://github.com/darkobits/nr/commit/f867b106bbee8219ab95420586052d67bcbe495c))

### [0.8.11](https://github.com/darkobits/nr/compare/v0.8.10...v0.8.11) (2022-02-10)


### 🏗 Chores

* Update dependencies. ([30d3438](https://github.com/darkobits/nr/commit/30d34382dfb69ef8b9b03792c6ce0e208c8d3be9))

### [0.8.10](https://github.com/darkobits/nr/compare/v0.8.9...v0.8.10) (2022-02-10)


### 🏗 Chores

* Update dependencies. ([363d831](https://github.com/darkobits/nr/commit/363d8310e6fa499262f5122ca9a05a21dad139b9))
* Update dependencies. ([0ee5e5d](https://github.com/darkobits/nr/commit/0ee5e5d740e426e9fe293f9cf707ca52440835b6))

### [0.8.9](https://github.com/darkobits/nr/compare/v0.8.8...v0.8.9) (2022-02-10)


### 🐞 Bug Fixes

* Update CLI argument names. ([5f0b664](https://github.com/darkobits/nr/commit/5f0b664b13467ec6c703d9e3d399409f6f206b73))

### [0.8.8](https://github.com/darkobits/nr/compare/v0.8.7...v0.8.8) (2022-02-10)


### 🛠 Refactoring

* `createBabelNodeCommand` uses `babel-node`. ([f086ab3](https://github.com/darkobits/nr/commit/f086ab3613a451b867801673dd2eaa8a86e2d2c2))
* Improve `ow` ESM import helper. ([73b2e57](https://github.com/darkobits/nr/commit/73b2e571685a9b3f4e6fdbe5640ec6bb2a8c1908))
* Improve matcher logic. ([2333992](https://github.com/darkobits/nr/commit/23339922111e56ccae43bd848cb816dd65b74582))
* Remove index. ([0c969e0](https://github.com/darkobits/nr/commit/0c969e099b160e59c6a0c6c2c085064cde3ad03e))


### 🏗 Chores

* Update ci.yml. ([3e07ec0](https://github.com/darkobits/nr/commit/3e07ec0510069ddfb66d8d1c8fd225000fcc674f))
* Update dependencies. ([33300d1](https://github.com/darkobits/nr/commit/33300d17f933b23c9f2012f0d4c28aa952fd39b3))
* Update usage instructions. ([48d7115](https://github.com/darkobits/nr/commit/48d71156b3bdd8dee0b9ad39ef11bb9e06bb1897))

### [0.8.7](https://github.com/darkobits/nr/compare/v0.8.6...v0.8.7) (2022-02-09)


### 🐞 Bug Fixes

* Fix log import. ([99dc9d0](https://github.com/darkobits/nr/commit/99dc9d0d23cb6dca845569ac223a72b1cf930bd6))

### [0.8.6](https://github.com/darkobits/nr/compare/v0.8.5...v0.8.6) (2022-02-09)


### 🏗 Chores

* Update dependencies. ([12c15af](https://github.com/darkobits/nr/commit/12c15af38774db90197990cd74a675d4c03ab69d))

### [0.8.5](https://github.com/darkobits/nr/compare/v0.8.4...v0.8.5) (2022-02-09)

### [0.8.4](https://github.com/darkobits/nr/compare/v0.8.3...v0.8.4) (2022-02-09)

### [0.8.3](https://github.com/darkobits/nr/compare/v0.8.3-beta.4...v0.8.3) (2022-02-09)

### [0.8.3-beta.4](https://github.com/darkobits/nr/compare/v0.8.3-beta.3...v0.8.3-beta.4) (2022-02-09)

### [0.8.3-beta.3](https://github.com/darkobits/nr/compare/v0.8.3-beta.2...v0.8.3-beta.3) (2022-02-09)


### 🐞 Bug Fixes

* Fix @babel/register resolve. ([2acf81b](https://github.com/darkobits/nr/commit/2acf81be2b51e98b59017c24730c1d427d77af76))

### [0.8.3-beta.2](https://github.com/darkobits/nr/compare/v0.8.3-beta.1...v0.8.3-beta.2) (2022-02-09)


### 🐞 Bug Fixes

* Fix path logic. ([bbd6b8b](https://github.com/darkobits/nr/commit/bbd6b8b8e7e49f84b5bbc14a10211b9329336cb4))

### [0.8.3-beta.1](https://github.com/darkobits/nr/compare/v0.8.3-beta.0...v0.8.3-beta.1) (2022-02-09)


### 🐞 Bug Fixes

* Re-add @babel/register. ([8f7fa2b](https://github.com/darkobits/nr/commit/8f7fa2ba566f61d48d51e94edfcae9c506e21679))

### [0.8.3-beta.0](https://github.com/darkobits/nr/compare/v0.8.2...v0.8.3-beta.0) (2022-02-09)


### 🛠 Refactoring

* Publish as ESM. ([41ccf8c](https://github.com/darkobits/nr/commit/41ccf8c24adf0fb879426576bcc697bbca8c6135))

### [0.8.2](https://github.com/darkobits/nr/compare/v0.8.1...v0.8.2) (2022-02-08)


### 🏗 Chores

* Update dependencies. ([0ea8569](https://github.com/darkobits/nr/commit/0ea8569a1edde350048fe81170aeb81b3bd82eca))


### 🐞 Bug Fixes

* Pass `createBabelNodeCommand` to factories. ([d35d705](https://github.com/darkobits/nr/commit/d35d70576fcc04a769fa3b2078ebb07d97271fc1))

### [0.8.1](https://github.com/darkobits/nr/compare/v0.8.0...v0.8.1) (2022-02-08)


### 🐞 Bug Fixes

* Add `@babel/register`. ([8147986](https://github.com/darkobits/nr/commit/8147986d56f262bff14454bef7c1b68c19100eed))

## [0.8.0](https://github.com/darkobits/nr/compare/v0.7.4...v0.8.0) (2022-02-08)


### 🏗 Chores

* Update dependencies. ([3b69da6](https://github.com/darkobits/nr/commit/3b69da611cbbce4d599ecf930ac7cbbcc925f401))


### ✨ Features

* Add `createBabelNodeCommand`. ([826615d](https://github.com/darkobits/nr/commit/826615d1e81f923fee11d24bc790cc77a9f87fef))

### [0.7.4](https://github.com/darkobits/nr/compare/v0.7.3...v0.7.4) (2021-08-13)


### 🛠 Refactoring

* Update error message. ([4151ad7](https://github.com/darkobits/nr/commit/4151ad7c83a1506446a162c6ad875deb1216ba24))


### 🏗 Chores

* **deps:** Update dependencies. ([27482db](https://github.com/darkobits/nr/commit/27482dbf8ad91e583fce82c6525e8ce4f508564a))
* **deps:** Update dependencies. ([5ddcb38](https://github.com/darkobits/nr/commit/5ddcb380d6244dc48f41101c856a42da2d393881))
* **deps:** Update dependencies. ([0047c13](https://github.com/darkobits/nr/commit/0047c13ff85860d3b6dae6d31e5029c04296b95c))
* Update ci.yml. ([5753188](https://github.com/darkobits/nr/commit/57531886ac77d0b9fcc283b2a179a12ba02cfa6c))

### [0.7.3](https://github.com/darkobits/nr/compare/v0.7.2...v0.7.3) (2021-07-21)


### 🐞 Bug Fixes

* Ensure processes exit with non-zero code on failure. ([43c91a0](https://github.com/darkobits/nr/commit/43c91a0500c8231a4e251f288a5288e84a1cd07c))

### [0.7.2](https://github.com/darkobits/nr/compare/v0.7.1...v0.7.2) (2021-07-21)


### 🐞 Bug Fixes

* Revert "Publish as ESM". ([ac11447](https://github.com/darkobits/nr/commit/ac11447497a5ca95279a9c9aef612667a45691c1))

### [0.7.1](https://github.com/darkobits/nr/compare/v0.7.0...v0.7.1) (2021-07-21)


### 🏗 Chores

* **deps:** Update dependencies. ([92b9618](https://github.com/darkobits/nr/commit/92b96185a865154b5e3676c714358086de3f6687))

## [0.7.0](https://github.com/darkobits/nr/compare/v0.6.6-beta.0...v0.7.0) (2021-07-21)


### ✨ Features

* Pass `isCi` to configuration factories. ([34bfd75](https://github.com/darkobits/nr/commit/34bfd75877b0bcd6c575495ebe3fe6098364c8aa))

### [0.6.6-beta.0](https://github.com/darkobits/nr/compare/v0.6.5...v0.6.6-beta.0) (2021-07-21)


### 🛠 Refactoring

* Publish as ESM. ([888a834](https://github.com/darkobits/nr/commit/888a8343b624c2ab04e775d2cb367bd37a4ed673))

### [0.6.5](https://github.com/darkobits/nr/compare/v0.6.4...v0.6.5) (2021-07-21)


### 🐞 Bug Fixes

* Invoke `getEscapedCommand` without first argument. ([95cb39d](https://github.com/darkobits/nr/commit/95cb39d26f5a523a31090613273fb802b8320c48))

### [0.6.4](https://github.com/darkobits/nr/compare/v0.6.3...v0.6.4) (2021-07-21)


### 🏗 Chores

* Use `getEscapedCommand` to log commands. ([3431688](https://github.com/darkobits/nr/commit/34316880a42a6e4a22be426e161b6a41269875ec))

### [0.6.3](https://github.com/darkobits/nr/compare/v0.6.2...v0.6.3) (2021-07-21)


### 🐞 Bug Fixes

* Delegate logging to command executors. ([a537463](https://github.com/darkobits/nr/commit/a537463ebac628bc09fcdfd60cc2ab14e487136d))

### [0.6.2](https://github.com/darkobits/nr/compare/v0.6.1...v0.6.2) (2021-07-21)


### 🐞 Bug Fixes

* Add `createNodeCommand` to typings. ([46a6f48](https://github.com/darkobits/nr/commit/46a6f48e154c2abaeabcf26dd1db00fb124e3ac5))

### [0.6.1](https://github.com/darkobits/nr/compare/v0.6.0...v0.6.1) (2021-07-21)


### 🐞 Bug Fixes

* Pass `createNodeCommand` to configuration factory. ([a3460a5](https://github.com/darkobits/nr/commit/a3460a5ab503a9d09891765807703f524bcdbb98))

## [0.6.0](https://github.com/darkobits/nr/compare/v0.5.5...v0.6.0) (2021-07-21)


### 🏗 Chores

* **deps:** Update dependencies. ([fe801d4](https://github.com/darkobits/nr/commit/fe801d41dc6699e4eb31ada54b20d9891234690e))


### ✨ Features

* Add `createNodeCommand`. ([f1ebd2a](https://github.com/darkobits/nr/commit/f1ebd2af9d008fea24b4dcd4547732b14d44b3a7))

### [0.5.5](https://github.com/darkobits/nr/compare/v0.5.4...v0.5.5) (2021-07-19)


### 🐞 Bug Fixes

* Run post scripts in correct order. ([23d2546](https://github.com/darkobits/nr/commit/23d25468fa10b6350c2ea77fc1c61ea054b7aa41))


### 🏗 Chores

* Improve command error messages. ([61c0468](https://github.com/darkobits/nr/commit/61c0468a4e91400c0a9de18e12751a1d774a9063))

### [0.5.4](https://github.com/darkobits/nr/compare/v0.5.3...v0.5.4) (2021-07-19)


### 🏗 Chores

* **deps:** Update dependencies. ([cf9f223](https://github.com/darkobits/nr/commit/cf9f2238407d4101ba16ac82541865217c052fcf))

### [0.5.3](https://github.com/darkobits/nr/compare/v0.5.2...v0.5.3) (2021-07-19)


### 🏗 Chores

* **deps:** Update dependencies. ([8f01b69](https://github.com/darkobits/nr/commit/8f01b69edabbfef2899fc7343bcd70fbf25800e4))

### [0.5.2](https://github.com/darkobits/nr/compare/v0.5.1...v0.5.2) (2021-07-19)


### 🏗 Chores

* **deps:** Update dependencies. ([b9500e5](https://github.com/darkobits/nr/commit/b9500e5889b2d387eaa70e89506a9b51c26a34ea))

### [0.5.1](https://github.com/darkobits/nr/compare/v0.5.0...v0.5.1) (2021-07-19)


### 🏗 Chores

* **deps:** Update dependencies. ([7fcb819](https://github.com/darkobits/nr/commit/7fcb819eb2b625e8743c8cd844a8dfed63a39c11))

## [0.5.0](https://github.com/darkobits/nr/compare/v0.4.0...v0.5.0) (2021-07-18)


### 📖 Documentation

* Update README. ([941237c](https://github.com/darkobits/nr/commit/941237c3a0876b4bb8532fd65c23f552e4c59b18))


### ✨ Features

* Support ESM syntax in configuration files. ([e988743](https://github.com/darkobits/nr/commit/e9887434bb0f22ba22f543c4e13d57f4827a4362))

## [0.4.0](https://github.com/darkobits/nr/compare/v0.3.1-beta.2...v0.4.0) (2021-07-17)

### [0.3.1-beta.2](https://github.com/darkobits/nr/compare/v0.3.1-beta.1...v0.3.1-beta.2) (2021-07-17)


### 🐞 Bug Fixes

* Use `defineProperty` to set function names. ([a1d0c48](https://github.com/darkobits/nr/commit/a1d0c4870f20636b4b9cc15a94f94526449e2565))

### [0.3.1-beta.1](https://github.com/darkobits/nr/compare/v0.3.1-beta.0...v0.3.1-beta.1) (2021-07-17)

### [0.3.1-beta.0](https://github.com/darkobits/nr/compare/v0.3.0...v0.3.1-beta.0) (2021-07-17)


### 🏗 Chores

* **deps:** Update dependencies. ([c8204c6](https://github.com/darkobits/nr/commit/c8204c6f8e37c24abe7ae7bd90e291fb059f8c67))


### 🛠 Refactoring

* Refactor signatures of `createCommand`, `createScript`. ([fb270a2](https://github.com/darkobits/nr/commit/fb270a2eefa7d8bb4d51875db63608ffad59baec))

## [0.3.0](https://github.com/darkobits/nr/compare/v0.2.0...v0.3.0) (2021-07-17)


### ✨ Features

* Improve resolution of string instructions. ([467cffd](https://github.com/darkobits/nr/commit/467cffd51684e15eaf8243db79609ac598b053af))


### 🏗 Chores

* **deps:** Update @darkobits/ts. ([9a55bc0](https://github.com/darkobits/nr/commit/9a55bc0d8d760c9b2de9c8dd58296b251016ffc7))
* Improve logging. ([1c7cda9](https://github.com/darkobits/nr/commit/1c7cda9990e4ca407aaa65a599cbe37b76e009e8))

## [0.2.0](https://github.com/darkobits/nr/compare/v0.1.0...v0.2.0) (2021-07-17)


### ✨ Features

* Add several features. ([e2fd2bf](https://github.com/darkobits/nr/commit/e2fd2bf6d8e3ef38ba12d6e2b43c375ee7acecba))

## 0.1.0 (2021-07-15)


### 🏗 Chores

* Add project boilerplate. ([9ce1ffe](https://github.com/darkobits/nr/commit/9ce1ffe275e324177fdc1fc6b2e8ef060e3a6fdd))


### ✨ Features

* Add nr. ([e6da485](https://github.com/darkobits/nr/commit/e6da485631ae78d38667c0bc198cae4071f70ca9))


### 📖 Documentation

* Add README. ([3007deb](https://github.com/darkobits/nr/commit/3007debeec4d0cc8dd9063114deb7c477d78c339))
