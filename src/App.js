// css
import './assets/css/pages/page-auth.css';
import './assets/css/core.css';
import './assets/css/theme-default.css';

import './assets/css/demo.css';

// fonts
import './assets/fonts/boxicons.css';

// scss
import './assets/libs/perfect-scrollbar/perfect-scrollbar.scss';
import './assets/scss/fonts/boxicons.scss';

// js

import './assets/js/main';
import './assets/libs/perfect-scrollbar/perfect-scrollbar';
import './assets/libs/jquery/jquery';
import './assets/libs/popper/popper';

import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Main2 from "./pages/Main2";
import NotFound from "./pages/NotFound";

import LoginPage from "./pages/account/LoginPage";
import VerifyPwd from "./pages/account/VerifyPwd";
import LeftMenu from "./pages/layout/LeftMenu";
import {useEffect, useState} from "react";
import api from "./api/api";

function App() {

    const [ leftMenuList, setLeftMenuList ] = useState([]);

    useEffect(() => {
        const getMenuList = async () => {
            const response = await api.get('/cms/menu/list');
            const responseData = response.data;
            if (responseData.code == 200) {
                let resultList = responseData.data;
                let menuList = [];
                for (let i = 0; i < resultList.length; i++) {
                    if (resultList[i].menuLevel == 1) {
                        let menu = {
                            cmsMenuSeq: resultList[i].cmsMenuSeq,
                            menuNm: resultList[i].menuNm,
                            menuCode: resultList[i].menuCode,
                            filePath: resultList[i].filePath,
                            isHaveChildren: false,
                            children: []
                        };

                        for (let j = 0; j < resultList.length; j++) {
                            if (resultList[j].menuLevel == 2 && resultList[i].authDir == resultList[j].authDir) {
                                menu.isHaveChildren = true;
                                menu.children.push({
                                    cmsMenuSeq: resultList[j].cmsMenuSeq,
                                    menuNm: resultList[j].menuNm,
                                    menuCode: resultList[j].menuCode,
                                    filePath: resultList[j].filePath,
                                });
                            }
                        }
                        menuList.push(menu);
                    }
                }
                setLeftMenuList(menuList);
            }
        };

        getMenuList();

    }, []);

    const renderParentPages = () => {
        return leftMenuList.map(leftMenu => {
            switch (leftMenu.menuCode) {
                case 'ADMIN_MANAGEMENT': return <Route path={leftMenu.filePath} id={leftMenu.cmsMenuSeq} element={<Main2/>}/>;
            }
        });
    }

    const renderChildPages = () => {
        return leftMenuList.map(leftMenu => {
            leftMenu.children.map(menu => {
                switch (menu.menuCode) {
                    case 'MANAGER_MANAGEMENT': return <Route path={menu.filePath} id={menu.cmsMenuSeq} element={<Main2/>}/>;
                }
            });
        });
    }

    const isLoggedIn = () => {
        return !!localStorage.getItem('Authorization');
    };

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={
                        <>
                            <AccountRoute isLoggedIn={isLoggedIn}>
                                <Routes>
                                    <Route path="/cms/console/login" element={<LoginPage/>}></Route>
                                    <Route path="/cms/verify/pwd" element={<VerifyPwd/>}></Route>
                                    <Route path="*" element={<NotFound/>}></Route>
                                </Routes>
                            </AccountRoute>
                            <PrivateRoute isLoggedIn={isLoggedIn}>
                                <div className="layout-wrapper layout-content-navbar">
                                    <div className="layout-container">
                                        <LeftMenu leftMenuList={leftMenuList}/>
                                        <Routes>
                                            <Route path="/cms/dashboard" element={<Dashboard/>}/>
                                            {renderPages()}
                                            <Route path="*" element={<NotFound/>}></Route>
                                        </Routes>
                                    </div>
                                </div>
                            </PrivateRoute>
                        </>
                    }/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

function AccountRoute({children, isLoggedIn}) {
    return !isLoggedIn() ? children : <Navigate to="/main1"/>;
}

function PrivateRoute({children, isLoggedIn}) {
    return isLoggedIn() ? children : <Navigate to="/cms/console/login"/>;
}

export default App;
