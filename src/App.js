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
import AuthMgmtListPage from "./pages/manager/AuthMgmtListPage";
import BannerMgmtListPage from "./pages/site/BannerMgmtListPage";
import BannerMgmtViewPage from "./pages/site/BannerMgmtViewPage";

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
                            authDir: resultList[i].authDir,
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
                        setManagerMgmtRoute(childPages, leftMenu, menu, ManagerMgmtListPage, ManagerMgmtViewPage);
                    }
                    case 'CMS_MENU_MANAGEMENT': {
                        setCmsMenuMgmtRoute(childPages, leftMenu, menu, CmsMenuMgmtListPage);
                    }
                    case 'ADMIN_AUTH_MANAGEMENT': {
                        setMenuAuthMgmtRoute(childPages, leftMenu, menu, AuthMgmtListPage);
                    }
                    case 'BANNER_MANAGEMENT': {
                        setBannerMgmtRoute(childPages, leftMenu, menu, BannerMgmtListPage, BannerMgmtViewPage);
                    }
                }
            });
        });
        return childPages;
    }
    
    const setManagerMgmtRoute = (childPages, leftMenu, menu, ListPageComponent, ViewPageComponent) => {
        setListPageRoute(childPages, leftMenu, menu, ListPageComponent);
        setViewPageRoute(childPages, leftMenu, menu, ViewPageComponent);
    };

    const setCmsMenuMgmtRoute = (childPages, leftMenu, menu, ListPageComponent) => {
        setListPageRoute(childPages, leftMenu, menu, ListPageComponent);
    };

    const setMenuAuthMgmtRoute = (childPages, leftMenu, menu, ListPageComponent) => {
        setListPageRoute(childPages, leftMenu, menu, ListPageComponent);
    };

    const setBannerMgmtRoute = (childPages, leftMenu, menu, ListPageComponent, ViewPageComponent) => {
        setListPageRoute(childPages, leftMenu, menu, ListPageComponent);
        setViewPageRoute(childPages, leftMenu, menu, ViewPageComponent);
    };
    
    const setListPageRoute = (childPages, leftMenu, menu, ListPageComponent) => {
        childPages.push(
            <Route
                key={menu.cmsMenuSeq}
                path={menu.filePath}
                id={menu.cmsMenuSeq}
                element={
                    <ListPageComponent
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
    }

    const setViewPageRoute = (childPages, leftMenu, menu, ViewPageComponent) => {
        childPages.push(
            <Route
                key={menu.cmsMenuSeq}
                path={menu.filePath.substring(0, menu.filePath.lastIndexOf('list')) + 'view'}
                id={menu.cmsMenuSeq + '-view'}
                element={
                    <ViewPageComponent
                        leftMenuInfo={{
                            parentNm: leftMenu.menuNm,
                            childNm: menu.menuNm
                        }}
                    />
                }
            />
        );
    }

    const isLoggedIn = () => {
        return !!localStorage.getItem('Authorization');
    };

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={
                        <PrivateRoute isLoggedIn={isLoggedIn}/>
                    }/>
                </Routes>
            </BrowserRouter>
        </div>
    );

    function PrivateRoute({isLoggedIn}) {
        return isLoggedIn() ?
            (
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
            ) :
            (
                <Routes>
                    <Route path="/cms/console/login" element={<LoginPage/>}></Route>
                    <Route path="/cms/verify/pwd" element={<VerifyPwd/>}></Route>
                    <Route path="*" element={<NotFound/>}></Route>
                </Routes>
            );
    }
}

export default App;
