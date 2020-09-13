## 2020.09.08 우아한테크러닝 3회차(19:00~22:00)


### Intro
- 리액트 기초
- 리액트 구현 실습


###  VDOM
- low level인 Real DOM(Document Object Model)을 이용해서 조작하는 것은 안정성이 떨어진다.  필연적으로 복잡도가 올라간다. 
- 해서, DOM을 다루기 보다 쉽게하기 위해서 Wrapping 등을 하는 방법이 사용되곤 했다.(JQuery) 
- 브라우저에 그려지는 태그들은 예컨대 문자열이라고 할 수 있다. 문자열은 다루기 힘들기 때문에 DOM Tree 형태로 만들어 핸들링한다.

- VDOM(Virtual DOM)도 이와 크게 다르지 않다. Real DOM을 핸들링하는 대신 추상화된 DOM을 새로 하나 만들고, 이를 핸들링하는 방식이다. 

```
const list = [
	{ title: "all about REACT" },
	{ title: "all about REDUX" },
	{ title: "all about TS" }
];

const rootElement = document.getElementById("root");

function app(items) {
  rootElement.innerHTML = `
  <ul> ${items.map((item) => `<li>${item.title}</li>`).join("")}</ul>`;
}

app(list);
```

- `rootElement.innerHTML`을 사용해 직접적으로 `Element`를 생성하여 넣어주고 있다. 이런 식으로 DOM을 직접 다루는 것은 앱의 규모가 커질 수록 복잡해지기 때문에 지양하는 것이 좋다.

###  리액트의 구조
- 리액트는 기본적으로 다음과 같은 구조를 갖고 있다.

```
function App() {
  return (
    <div>
      <h1>hello world</h1>
      <ul className="board" onClick={() => null}>
        <Hello label="Hello" />
        <Hello label="World" />
        <Hello label="React" />
      </ul>
    </div>
  );
}

render(<App />, document.getElementById("root"));
```

- 이 코드는 다음과 같이 트랜스파일링된다. 

```
import React from "react";

function App() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "1"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "React"), /*#__PURE__*/React.createElement("li", null, "Redux"), /*#__PURE__*/React.createElement("li", null, "TypeScript"), /*#__PURE__*/React.createElement("li", null, "mobx")));
}

ReactDOM.render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(App, null)), document.getElementById("root"));
```

- `ReactDOM.render`는 첫번째 인자로 렌더링할 내용을 JSX형태로 받고, 두번째 인자로는 렌더링 된 첫번째 인자를 붙일 DOM을 받는다.
- 위 코드에서,  `React.createElement`는 `App()`의 반환값인 JSX를 받아서, HTML 요소를 만들어주는 역할을한다. 컴포넌트를 렌더링 할때마다 변환 단계에서 각 컴포넌트들은  `React.createElement`를 통해서 HTML요소로 변환되는 것이다.

### React.createElement(type, props, children)

```
/* @jsx hh */
import { createElement, render } from "./tiny-react";

function Hello(props) {
  return <li className="item">{props.label}</li>;
}

function App() {
  return (
    <div>
      <h1>hello world</h1>
      <ul className="board" onClick={() => null}>
        <Hello label="Hello" />
        <Hello label="World" />
        <Hello label="React" />
      </ul>
    </div>
  );
}

render(<App />, document.getElementById("root"));
```

- `@jsx` react 컴파일러 옵션에서 사용하는 팩토리 함수는 설정이 가능하다. jsxFactory 명령 줄 옵션을 사용하거나 인라인 @jsx 주석을 사용하여 파일별로 가능. 예를 들어 jsxFactory에 createElement를 설정했다면, <div />는 React.createElement("div") 대신 createElement("div")으로 생성되는 식이다. `@jsx` 옵션으로 `element`를 생성할 때 `createElement`로 생성하게끔해보자.

```
function createElement(type, props = {}, ...children) {
    return { type, props, children };
}
```

-  태그의 타입, proproperties, chiledren(가변인자)으로 구성되어 있고 이를 객체 형태로 반환하도록 하 `createElement("li", null, "TypeScript")` 를 수행하는 경우 아래와 같은 객체가 반환 되도록 한다. 

```
{
	type : "li",
	prop: null,
	children: "TypeScript"
	//자식요소가 있다면 한번더 createElement
}
``` 

### Tiny React(Live coding)
```
/*@jsx createElement */
import React from "react";
import ReactDOM from "react-dom";
import { createElement, render } from "./tiny-react";

function StudyList() {
  return (
    <ul>
      <li>React</li>
      <li>Redux</li>
      <li>MobX</li>
      <li>Typescript</li>
    </ul>
  );
}


function App() {
  return (
    <div>
      <h1>Hello?</h1>
      <StudyList />
    </div>
  );
}
```

```
//tiny-react.js 
function renderElement(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  if (node === undefined) return;

  const $el = document.createElement(node.type);

  node.children.map(renderElement).forEach((node) => {
    $el.appendChild(node);
  });

  return $el;
}

export function render(vdom, container) {
  container.appendChild(renderElement(vdom));
}

export function createElement(type, props, ...children) {
  return { type, props, children };
}

```

- `createElement `를 이용해 객체를 생성하고 `console.log`를 찍어보면 아래와 같이 나온다.

```
Object {type: function App(), props: Object, children: Array[0]}
	type: function App() {}
	<constructor>: "Function"
	name: "Function"
	props: Object
	__source: Object
	children: Array[0]
```

-  `JSX` 코드가 컴파일 되긴 하지만, App의 타입이 Function으로 나타난다. type이 function임을 확인하고 function이라면 전달된 인자를 apply로 전달하여 호출하도록 createElement의 코드를 수정한다. 

```
function createElement(type, props = {}, ...children) {
    if (typeof type === "function") {
        return type.apply(null, [props, ...children]);
    }

    return { type, props, children };
}
```

- 결과는 다음과 같다.

```
Object {type: "div", props: Object, children: Array[2]} {
	type: "div"
	props: Object
	__source: Object
	children: Array[2]
		0: Object
		type: "h1"
		props: Object
		children: Array[1]
			0: "Hello?"
			1: Object
				type: "ul"
				props: Object
				children: Array[4]
					0: Object
						type: "li"
						props: Object
						children: Array[1]
					1: Object
					2: Object
					3: Object
```

- 잘 나온다.ㅎ
- 이렇게 구성된 Element들은 renderElement을 이용하여 실제 DOM으로 그려질 수 있다. 

```
function renderElement(node) {
  if (typeof node === "string") {
    return document.createTextNode(node); // node의 타입이 string이 될 때까지 반복적으로 호출하게 된다.
  }

  if (node === undefined) return;

  const $el = document.createElement(node.type);

  node.children.map(renderElement).forEach((node) => {
    $el.appendChild(node);
  });

  return $el;
}
```
