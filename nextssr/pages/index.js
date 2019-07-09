import React from "react";
import Link from "next/link";

import Head from "next/head";

import withAnalytics from "../src/hocs/withAnalytics";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <img src="/static/images/kakaroto.jpg" width="200" alt="Goku" />
      <h1>Hello world!</h1>
      <Link href="/users">
        <a>Usuários</a>
      </Link>
    </div>
  );
};
export default withAnalytics()(Home);
