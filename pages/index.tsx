import type { NextPage } from 'next'
import Head from 'next/head'
import Main from '@components/Home/Main'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>eyeVocab</title>
      </Head>
      <Main />
    </>
  )
}

export default Home
