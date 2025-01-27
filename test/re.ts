import { Secrets, secrets as secretsInstance } from '../src/secrets_re.ts'
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