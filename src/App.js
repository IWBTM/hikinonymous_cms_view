import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main1 from "./pages/Main1";
import Main2 from "./pages/Main2";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/main1" element={<Main1/>}></Route>
                <Route path="/main2" element={<Main2/>}></Route>
                <Route path="*" element={<NotFound/>}></Route>
            </Routes>
            <div className="buy-now">
                <a
                    href="https://themeselection.com/products/sneat-bootstrap-html-admin-template/"
                    target="_blank"
                    className="btn btn-danger btn-buy-now"
                >Upgrade to Pro</a
                >
            </div>
        </BrowserRouter>
    </div>
  );
}

export default App;
