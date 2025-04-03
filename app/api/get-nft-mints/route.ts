// app/api/get-nft-mints/route.ts
import { NextResponse } from 'next/server';
import { Connection, PublicKey, clusterApiUrl, Cluster } from '@solana/web3.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicKey } = body;
    if (!publicKey) {
      return NextResponse.json({ success: false, error: 'Falta publicKey' }, { status: 400 });
    }
    const walletPubKey = new PublicKey(publicKey);
    const network = (process.env.SOLANA_NETWORK as Cluster) || 'devnet';
    const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl(network);
    const connection = new Connection(rpcUrl, 'confirmed');

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPubKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    const nftMints = tokenAccounts.value
      .filter(acct => {
        const info = acct.account.data.parsed.info;
        const amount = info.tokenAmount.uiAmount;
        return amount && amount > 0;
      })
      .map(acct => acct.account.data.parsed.info.mint);

    return NextResponse.json({ success: true, nftMints });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
