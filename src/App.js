import React from "react";
const SesstionItem = ({ title }) => <li>{title}</li>;
const App = (props) => {
  const [displayOrder, toggleDisplayOrder] = React.useState("ASC");
  // 상태를 만들고 저장해주는 훅
  const onToggleDisplayOrder = () => {
    toggleDisplayOrder(displayOrder === "ASC" ? "DESC" : "ASC");
  const { sessionList } = props.store;
  const order = sessionList.map((session, i) => ({
    ...session,
    order: i
  }));
  return (
    <div>
      <header>
        <h1> hello ongyjho </h1>
      </header>
      <p>
        전체 세션 갯수: {sessionList.length} 개 {displayOrder}
      </p>
      <button onClick={onToggleDisplayOrder}> 재정렬 </button>
      <ul>
        {sessionList.map((session) => (
          <SesstionItem title={session.title} />
        ))}
      </ul>
    </div>
  );
};

export default App;
