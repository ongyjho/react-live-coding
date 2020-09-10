import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");
const sessionList = [
  { id: 1, title: "1회차: overview" },
  { id: 2, title: "2회차: redux 만들기" },
  { id: 3, title: "3회차: react 만들기" },
  { id: 4, title: "4회차: 컴포넌트 디자인 앱 만들기" }
];
ReactDOM.render(
  <React.StrictMode>
    <App store={{ sessionList }} />
  </React.StrictMode>,
  rootElement
);
