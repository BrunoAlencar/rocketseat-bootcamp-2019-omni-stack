import React from "react";
import "./css/style.css";

// components
import Header from "./components/Header";
import PostList from "./components/PostList";

function App() {
  return (
    <div>
      <Header />
      <PostList />
    </div>
  );
}

export default App;
