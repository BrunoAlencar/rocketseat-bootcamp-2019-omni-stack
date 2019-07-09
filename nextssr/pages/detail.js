import React from "react";
import axios from "axios";

import withAnalytics from "../src/hocs/withAnalytics";

const Detail = ({ user }) => (
  <div>
    <h1>{user.login}</h1>
    <img src={user.avatar_url} width="200" alt={user.login} />
  </div>
);

Detail.getInitialProps = async () => {
  const response = await axios.get("https://api.github.com/users/diego3g");

  return { user: response.data };
};

export default withAnalytics()(Detail);
