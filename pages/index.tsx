import React, { FC } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const DynamicInsertionSort = dynamic(
  () => import('../components/InsertionSort'),
  { loading: () => <p>loading...</p>, ssr: false }
)

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <div className='hero'>
      <h1 className='title'>Welcome to Next.js!</h1>
    </div>

    <DynamicInsertionSort />

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
        text-align: center;
      }
      .box {
        height: 120px;
        background-color: red;
        position: relative;
        transform: rotateX(180deg);
      }
    `}</style>
  </div>
)

export default Home
