import Head from 'next/head';
import config from '@config';
import { MintForm, MintInfo } from '@features/mint';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Crypto cactus</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to Crypto Cactus ({config.chainName})
        </h1>

        <p className="mt-3 text-2xl">Collection with spikes</p>

        <MintForm />
        <MintInfo />
      </main>
    </div>
  );
}
