import React from "react";
import PropTypes from "prop-types";

import Comment from "./Comment";

function Post({ data }) {
  return (
    <div className="post">
      <div className="post-profile">
        <img src={data.author.avatar} alt="Avatar" />
        <div>
          <strong>{data.author.name}</strong>
          <span>{data.date}</span>
        </div>
      </div>
      <div className="post-content">{data.content}</div>
      <div className="post-comments">
        {data.comments.map(comment => (
          <Comment key={comment.id} data={comment} />
        ))}
      </div>
    </div>
  );
}

Post.propTypes = {
  data: PropTypes.object.isRequired
};

export default Post;
