import React from "react";
import PropTypes from "prop-types";

function Comment({ data }) {
  return (
    <div className="comment">
      <img src={data.author.avatar} alt="Avatar" />
      <div className="comment-text">
        <p>
          <strong>{data.author.name}</strong>
          {data.content}
        </p>
      </div>
    </div>
  );
}

Comment.propTypes = {
  data: PropTypes.object.isRequired
};

export default Comment;
