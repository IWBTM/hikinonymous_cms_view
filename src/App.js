// css
import './assets/css/pages/page-auth.css';
import './assets/css/core.css';
import './assets/css/theme-default.css';

import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Main1 from "./pages/Main1";
import Main2 from "./pages/Main2";
import NotFound from "./pages/NotFound";

import LoginPage from "./pages/LoginPage";

const loginPath = "/cms/console/login";

function App() {
    const isLoggedIn = () => {
        return !!localStorage.getItem('Authorization');
    };

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path={loginPath} element={<LoginPage/>}></Route>
                    <Route path="*" element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <Routes>
                                <Route path="/main1" element={<Main1/>}/>
                                <Route path="/main2" element={<Main2/>}/>
                                <Route path="*" element={<NotFound/>}></Route>
                            </Routes>
                        </PrivateRoute>
                    }/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

function PrivateRoute({children, isLoggedIn}) {
    return isLoggedIn() ? children : <Navigate to={loginPath}/>;
}

export default App;
