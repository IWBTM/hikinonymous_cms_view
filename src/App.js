// css
import './assets/css/pages/page-auth.css';
import './assets/css/core.css';
import './assets/css/theme-default.css';

import './assets/css/demo.css';
import './assets/css/pages/page-misc.css';

// fonts
import './assets/fonts/boxicons.css';

// scss
import './assets/scss/fonts/boxicons.scss';
import './assets/libs/perfect-scrollbar/perfect-scrollbar.scss';

// js
import './assets/js/main';
import './assets/libs/perfect-scrollbar/perfect-scrollbar';
import './assets/libs/jquery/jquery';
import './assets/libs/popper/popper';

import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManagerMgmtListPage from "./pages/manager/ManagerMgmtListPage";
import NotFound from "./pages/NotFound";

import LoginPage from "./pages/account/LoginPage";
import VerifyPwd from "./pages/account/VerifyPwd";
import LeftMenu from "./layout/LeftMenu";
import {useEffect, useState} from "react";
import api from "./api/api";
import ManagerMgmtViewPage from "./pages/manager/ManagerMgmtViewPage";
import Header from "./layout/Header";
import CmsMenuMgmtListPage from "./pages/manager/CmsMenuMgmtListPage";
import CmsMenuMgmtViewPage from "./pages/manager/CmsMenuMgmtViewPage";

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

    const renderPages = () => {
        let childPages = [];
        leftMenuList.map(leftMenu => {
            leftMenu.children.map(menu => {
                switch (menu.menuCode) {
                    case 'MANAGER_MANAGEMENT': {
                        childPages.push(
                            <Route
                                path={menu.filePath}
                                id={menu.cmsMenuSeq}
                                element={
                                    <ManagerMgmtListPage
                                        leftMenuInfo={{
                                                parentNm: leftMenu.menuNm,
                                                childNm: menu.menuNm
                                        }}
                                        filePath={
                                            menu.filePath
                                        }
                                    />
                                }
                            />
                        );
                        childPages.push(
                            <Route
                                path={menu.filePath.substring(0, menu.filePath.lastIndexOf('list')) + 'view'}
                                id={menu.cmsMenuSeq + '-view'}
                                element={
                                    <ManagerMgmtViewPage
                                        leftMenuInfo={{
                                            parentNm: leftMenu.menuNm,
                                            childNm: menu.menuNm
                                        }}
                                    />
                                }
                            />
                        );
                    } break;
                    case 'CMS_MENU_MANAGEMENT': {
                        childPages.push(
                            <Route
                                path={menu.filePath}
                                id={menu.cmsMenuSeq}
                                element={
                                    <CmsMenuMgmtListPage
                                        leftMenuInfo={{
                                            parentNm: leftMenu.menuNm,
                                            childNm: menu.menuNm
                                        }}
                                        filePath={
                                            menu.filePath
                                        }
                                    />
                                }
                            />
                        );
                        childPages.push(
                            <Route
                                path={menu.filePath.substring(0, menu.filePath.lastIndexOf('list')) + 'view'}
                                id={menu.cmsMenuSeq + '-view'}
                                element={
                                    <CmsMenuMgmtViewPage
                                        leftMenuInfo={{
                                            parentNm: leftMenu.menuNm,
                                            childNm: menu.menuNm
                                        }}
                                    />
                                }
                            />
                        );
                    }break;
                }
            });
        });
        return childPages;
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
                            <PrivateRoute isLoggedIn={isLoggedIn}>
                                <div className="layout-wrapper layout-content-navbar">
                                    <div className="layout-container">
                                        <LeftMenu leftMenuList={leftMenuList}/>
                                        <div className="layout-page">
                                            <Header/>
                                            <Routes>
                                                <Route path="/cms/dashboard" element={<Dashboard/>}/>
                                                {renderPages()}
                                                <Route path="*" element={<NotFound/>}></Route>
                                            </Routes>
                                        </div>
                                    </div>
                                </div>
                            </PrivateRoute>
                            <Routes>
                                <Route path="/cms/console/login" element={<LoginPage/>}></Route>
                                <Route path="/cms/verify/pwd" element={<VerifyPwd/>}></Route>
                                <Route path="*" element={<NotFound/>}></Route>
                            </Routes>
                        </>
                    }/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

function PrivateRoute({children, isLoggedIn}) {
    return isLoggedIn() ? children : <Navigate to="/cms/console/login"/>;
}

export default App;
