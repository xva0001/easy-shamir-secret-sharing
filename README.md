# Secrets Library

`secrets_re.ts` 是一個用於秘密分享和重建的 TypeScript 庫，基於 Shamir 的秘密分享方案。此庫允許將一個秘密分割成多個分享，並且需要一定數量的分享才能重建原始秘密。
`secrets_re.ts` is a TypeScript library for secret sharing and reconstruction based on Sh

## 安裝 / Installation

首先，確保你已經安裝了必要的依賴項：
First, make sure you have installed the necessary dependencies:

```sh
npm install
```

## 使用方法 / Usage

初始化 class Secrets
在使用 Secrets 類之前，需要先導入並初始化它：

Before using the Secrets class, you need to import and initialize it:

```Typescript
import { Secrets } from './secrets_re';

const secrets = new Secrets();
```

### 生成隨機數 / Generate Random Number

使用 random 方法生成指定位數的隨機數：
Use the random method to generate a random number with the specified number of bits:

```Typescript
const randomValue = secrets.random(512);
console.log(randomValue);
```

### 分割秘密 / Split Secret

使用 share 方法將秘密分割成多個分享：
Use the share method to split a secret into multiple shares:

```Typescript
const secret = "your-secret";
const numShares = 10;
const threshold = 5;
const shares = secrets.share(secret, numShares, threshold);
console.log(shares);
```

### 重建秘密 / Combine Secret

使用 combine 方法重建秘密：
Use the combine method to reconstruct the secret:

```Typescript
const combinedSecret = secrets.combine(shares);
console.log(combinedSecret);

```

### 生成新分享

使用 newShare 方法生成新的分享：
Use the newShare method to generate a new share:

```Typescript
const newShare = secrets.newShare(8, shares);
console.log(newShare);
```

## 貢獻 / Contributing

歡迎提交問題和請求，或創建拉取請求來改進此庫。

Issues and requests are welcome, or create a pull request to improve this library

## 授權 / License

此項目基於 MIT 許可證，詳情請參閱 LICENSE 文件。
This project is licensed under the MIT License. See the LICENSE file for details.

## 額外 / Remain

@preserve author Alexander Stetsyuk
@preserve author Glenn Rempe <glenn@rempe.us>
@license MIT

reference: [https://www.npmjs.com/package/secrets.js-grempe](https://www.npmjs.com/package/secrets.js-grempe)

The MIT License (MIT)
Author of the original secrets.js library: Alexander Stetsyuk, Glenn Rempe
Author of this fork and modifications: xva001

 no warranty is given that this code is correct, and the author cannot be held responsible for any errors or omissions.
 rewrite by xva001
 purpose: use typescript to rewrite the secrets.js-grempe library to use on other project (xva001 fogx -- nuxt) with no dependency on node crypto library.
