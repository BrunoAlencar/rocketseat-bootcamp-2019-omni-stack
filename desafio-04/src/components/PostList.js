import React, { Component } from "react";
import Post from "./Post";

const url =
  "https://i.pinimg.com/originals/2b/85/d3/2b85d3ecc1542e456c3036df53b3fc8a.jpg";
class PostList extends Component {
  state = {
    posts: [
      {
        id: 1,
        author: {
          name: "Diego Fernandes",
          avatar: url
        },
        date: "04 Jun 2019",
        content: "Pessoal, alguém sabe se a Rocketseat está contratando?",
        comments: [
          {
            id: 1,
            author: {
              name: "Diego Fernandes",
              avatar: url
            },
            content:
              "Conteúdo do comentário, Conteúdo do comentário, Conteúdo do comentário. Conteúdo do comentário.Conteúdo do comentário"
          },
          {
            id: 2,
            author: {
              name: "Bruno Alencar",
              avatar: url
            },
            content: "Comentário dois"
          }
        ]
      },
      {
        id: 2,
        author: {
          name: "Bruno Alencar",
          avatar: url
        },
        date: "04 Jul 2019",
        content: "Pessoal, alguém sabe se a Rocketseat está contratando?",
        comments: [
          {
            id: 1,
            author: {
              name: "Bruno Alencar",
              avatar: url
            },
            content: "Espero que sim gostaria de continuar com eles!"
          }
        ]
      }
    ]
  };

  render() {
    return (
      <div className="posts-list content">
        {this.state.posts.map(post => (
          <Post key={post.id} data={post} />
        ))}
      </div>
    );
  }
}

export default PostList;
