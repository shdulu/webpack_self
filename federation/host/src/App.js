import React from "react";
import Slider from "./Slider";
const RemoteBankList = React.lazy(() => import("remote/BankList"));
const App = () => {
  return (
    <div>
      <h2>本地组件</h2>
      <Slider></Slider>
      <h2>远程组件</h2>
      <React.Suspense fallback="loading BankList">
        <RemoteBankList/>
      </React.Suspense>
    </div>
  );
};
export default App;
