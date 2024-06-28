// css
import './assets/vendor/fonts/boxicons.css';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import './assets/vendor/libs/apex-charts/apex-charts.css';

// js
import './assets/vendor/js/helpers.js';
import './assets/vendor/libs/jquery/jquery.js';
import './assets/vendor/libs/popper/popper.js';
import './assets/vendor/js/bootstrap.js';
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js';
import './assets/vendor/js/menu.js';
import './assets/vendor/libs/apex-charts/apexcharts.js';
import './assets/js/bootstrap.js';
import './assets/js/helpers.js';
import './assets/js/menu.js';
import './assets/js/main.js';
import './assets/js/config.js';
import './assets/js/dashboards-analytics.js';

import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
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
                                <Route path="/cms/dashboard" element={<DashboardPage/>}/>
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
