# Secrets Library

這個庫提供了一些方法來生成隨機數、分割秘密和重建秘密。
This library provides methods to generate random numbers, split secrets, and reconstruct secrets.

此庫是基於 [secrets.js-grempe](https://www.npmjs.com/package/secrets.js-grempe) 和 [shamir-secret-sharing](https://www.npmjs.com/package/shamir-secret-sharing) 進行修改的。
This library is based on modifications of [secrets.js-grempe](https://www.npmjs.com/package/secrets.js-grempe) and [shamir-secret-sharing](https://www.npmjs.com/package/shamir-secret-sharing).

修改的目的是使用 TypeScript 重寫 secrets.js-grempe 庫，以便在其他項目中使用，且不依賴於 Node 的 crypto 庫。
The purpose of the modifications is to rewrite the secrets.js-grempe library using TypeScript for use in other projects without dependency on the Node crypto library.

此庫提供了兩種編程風格：已實例化的物件風格和函數風格。
This library provides two programming styles: an instantiated object style and a functional style.

## 安裝 / Installation

首先，確保你已經安裝了必要的依賴項：
First, make sure you have installed the necessary dependencies:

```sh
npm i easy-shamir-secret-sharing
```

## 使用方法 / Usage

初始化 class Secrets
在使用 Secrets 類之前，需要先導入並初始化它：

Before using the Secrets class, you need to import and initialize it:

```Typescript
import { Secrets } from 'easy-shamir-secret-sharing';
//or
import { secrets } from 'easy-shamir-secret-sharing';


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

### 示例代碼 / Example Code

please run in async function

```Typescript
import { Secrets, secrets as secretsInstance } from 'easy-shamir-secret-sharing'
async function main()
{
    const message = "這是兩段重要的訊息";
    let secrets : any = new Secrets(message, 4, 3); //in real, no any type used
    await secrets.executeShares();
    console.log("分割後的訊息段:", secrets.getSharesResult());
    await secrets.executeCombine(secrets.getSharesResult());
    console.log("還原後的密文:", secrets.getCombinedResult());
    //or
    console.log("另一種風格");
    secrets = secretsInstance
    const arr = await secrets.share(message, 4, 3)
    console.log("分割後的訊息段:", arr);
    const combined = await secrets.combine(arr)
    console.log("還原後的密文:", combined);
}
main()
```

## 貢獻 / Contributing

歡迎提交問題和請求，或創建拉取請求來改進此庫。

Issues and requests are welcome, or create a pull request to improve this library

## 授權 / License

此項目基於 MIT 許可證，詳情請參閱 LICENSE 文件。
This project is licensed under the MIT License. See the LICENSE file for details.

## 額外 / Remain

reference:
The MIT License (MIT)
Author of the original secrets.js library: Alexander Stetsyuk, Glenn Rempe
Author of this fork and modifications: xva001
@license MIT
[https://www.npmjs.com/package/secrets.js-grempe](https://www.npmjs.com/package/secrets.js-grempe)
The Library used
@license Apache-2.0
[shamir-secret-sharing](https://www.npmjs.com/package/shamir-secret-sharing)

 no warranty is given that this code is correct, and the author cannot be held responsible for any errors or omissions.
 rewrite by xva001
 purpose: use typescript to rewrite the secrets.js-grempe library to use on other project (xva001 fogx -- nuxt) with no dependency on node crypto library.

[repo](https://github.com/xva0001/secret_grempe_rewrite/tree/main)
[npm](https://www.npmjs.com/package/secretsjs_grempe_rewrite?activeTab=readme)

## 更新 / Update detail

2025-01-27 change reference to [shamir-secret-sharing](https://www.npmjs.com/package/shamir-secret-sharing)

First aims is making this work, and let other easy to use.
