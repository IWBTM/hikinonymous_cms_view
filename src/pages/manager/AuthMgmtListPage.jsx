import {useEffect, useRef, useState} from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import MenuTitle from "../../layout/MenuTitle";

const AuthMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [ managerTableResult, setManagerTableResult ] = useState({});
    
    const [ parentTableResult, setParentTableResultList ] = useState({});
    const [ childTableResult, setChildTableResultList ] = useState({});

    const [ parentAuthTableResult, setParentAuthTableResultList ] = useState({});
    const [ childAuthTableResult, setChildAuthTableResultList ] = useState({});

    const [ isLoadingOfManager, setIsLoadingOfManager ] = useState(false);
    const [ isLoadingOfAuthParent, setIsLoadingOfAuthParent ] = useState(false);
    const [ isLoadingOfAuthChild, setIsLoadingOfAuthChild ] = useState(false);
    const [ isLoadingOfParent, setIsLoadingOfParent ] = useState(false);
    const [ isLoadingOfChild, setIsLoadingOfChild ] = useState(false);

    const formRef = useRef();

    useEffect(() => {
        const getManagerTableResultList = async () => {
            setIsLoadingOfManager(true);
            const response = await api.get('/cms/admin/manager/list');
            setIsLoadingOfManager(false);
            const responseData = response.data;
            if (responseData.code === 200) {
                setManagerTableResult(responseData.data);
            }
        };

        getManagerTableResultList();
    }, []);

    const renderRows = () => {
        if (!managerTableResult.empty && managerTableResult.content) {
            return managerTableResult.content.map((row, index) => {
                let rowNum = (managerTableResult.totalElements - managerTableResult.totalPages) * (managerTableResult.number + index + 1);
                return <tr className="cursor-pointer" id={row.managerSeq} bindObj={JSON.stringify(row)} onClick={clickManagerRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <td>{row.managerNm}</td>
                    <td>{row.managerId}</td>
                    <td>{row.managerStatus}</td>
                </tr>;
            }).reverse();
        }
    }

    const clearChildRow = () => {
        setChildTableResultList([]);
        setChildAuthTableResultList([]);
    }

    const clickManagerRow = (e) => {
        const bindObj = e.currentTarget.getAttribute('bindObj')
        bindToWriteForm(JSON.parse(bindObj));

        getParentTableList();
        getParentAuthTableList();
        clearChildRow();
    }

    const clickParentAuthRow = (e) => {
        const bindObj = e.currentTarget.getAttribute('bindObj')
        bindToWriteForm(JSON.parse(bindObj));

        getChildAuthTableList();
    }

    const clickParentRow = (e) => {
        const bindObj = e.currentTarget.getAttribute('bindObj')
        bindToWriteForm(JSON.parse(bindObj));

        getChildTableList();
    }

    const clickChildRow = (e) => {
        const bindObj = e.currentTarget.getAttribute('bindObj')
        bindToWriteForm(JSON.parse(bindObj));
    }

    const bindToWriteForm = (bindObj) => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        formData.forEach((value, key) => {
            if (bindObj[key]) {
                elements[key].value = bindObj[key];
            }
        })

        elements['managerAuthSeq'].value = bindObj['managerAuthSeq'];

        document.getElementById("menuNm").innerText = bindObj['menuNm'] ? bindObj['menuNm'] : document.getElementById("menuNm").innerText;
        document.getElementById("managerNm").innerText = bindObj['managerNm'] ? bindObj['managerNm'] : document.getElementById("managerNm").innerText;

        document.getElementsByName('authTypes').forEach(ele => {
            if (bindObj['authTypes'] && bindObj['authTypes'].indexOf(ele.value) > -1) {
                ele.checked = true;
            } else {
                ele.checked = false;
            }
        })
    }

    const getParentTableList = async () => {
        const managerSeq = document.getElementById('managerSeq').value;
        setIsLoadingOfParent(true);
        const response = await api.get(`/cms/admin/auth/menu/list/${managerSeq}?isExist=false`);
        setIsLoadingOfParent(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setParentTableResultList(responseData.data);
        }
    };

    const getChildTableList = async () => {
        const managerSeq = document.getElementById('managerSeq').value;
        const authDir = document.getElementById('authDir').value;
        setIsLoadingOfChild(true);
        const response = await api.get(`/cms/admin/auth/menu/list/${managerSeq}?authDir=${authDir}&isExist=false`);
        setIsLoadingOfChild(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setChildTableResultList(responseData.data);
        }
    }

    const getParentAuthTableList = async () => {
        const managerSeq = document.getElementById('managerSeq').value;
        setIsLoadingOfAuthParent(true);
        const response = await api.get(`/cms/admin/auth/menu/list/${managerSeq}?isExist=true`);
        setIsLoadingOfAuthParent(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setParentAuthTableResultList(responseData.data);
        }
    };

    const getChildAuthTableList = async () => {
        const managerSeq = document.getElementById('managerSeq').value;
        const authDir = document.getElementById('authDir').value;
        setIsLoadingOfAuthChild(true);
        const response = await api.get(`/cms/admin/auth/menu/list/${managerSeq}?authDir=${authDir}&isExist=true`);
        setIsLoadingOfAuthChild(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setChildAuthTableResultList(responseData.data);
        }
    }

    const renderParentAuthRows = () => {
        if (parentAuthTableResult.length && !parentAuthTableResult.empty) {
            return parentAuthTableResult.map((row, index) => {
                let rowNum = index + 1;
                return <tr className="cursor-pointer" bindObj={JSON.stringify(row)}
                           onClick={clickParentAuthRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.menuNm}</th>
                    <th scope="row">{getAuthTypesText(row.authTypes)}</th>
                </tr>;
            }).reverse();
        }
    }

    const renderChildAuthRows = () => {
        if (childAuthTableResult.length && !childAuthTableResult.empty) {
            return childAuthTableResult.map((row, index) => {
                let rowNum = index + 1;
                return <tr className="cursor-pointer" bindObj={JSON.stringify(row)} onClick={clickChildRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.menuNm}</th>
                    <th scope="row">{getAuthTypesText(row.authTypes)}</th>
                </tr>;
            }).reverse();
        }
    }

    const renderParentRows = () => {
        if (parentTableResult.length && !parentTableResult.empty) {
            return parentTableResult.map((row, index) => {
                let rowNum = index + 1;
                return <tr className="cursor-pointer" bindObj={JSON.stringify(row)}
                           onClick={clickParentRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.menuNm}</th>
                </tr>;
            }).reverse();
        }
    }

    const renderChildRows = () => {
        if (childTableResult.length && !childTableResult.empty) {
            return childTableResult.map((row, index) => {
                let rowNum = index + 1;
                return <tr className="cursor-pointer" bindObj={JSON.stringify(row)} onClick={clickChildRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.menuNm}</th>
                </tr>;
            }).reverse();
        }
    }

    const getAuthTypesText = (authTypes) => {
        let authTypesText = '';
        if (authTypes) {
            authTypesText += authTypes.indexOf('C') > -1 ? ' 등록' : ''
            authTypesText += authTypes.indexOf('R') > -1 ? ' 조회' : ''
            authTypesText += authTypes.indexOf('U') > -1 ? ' 수정' : ''
            authTypesText += authTypes.indexOf('D') > -1 ? ' 삭제' : ''
        }
        return authTypesText;
    }

    const proc = async () => {
        if (!valid()) return;
        const formData = new FormData(formRef.current);
        let requestDto = {};
        formData.forEach((value, key) => {
            if (key == 'authTypes') {
                requestDto[key] += value;
            } else {
                requestDto[key] = value;
            }

            let undefinedIndex = requestDto[key].indexOf('undefined');
            if (undefinedIndex > -1) {
                requestDto[key] = requestDto[key].substring(0, undefinedIndex) + requestDto[key].substring('undefined'.length, requestDto[key].length);
            }
        })
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('list'))}proc`, JSON.stringify(requestDto));

        const responseDto = response.data;
        if (responseDto.code === 200) {
            getParentTableList();
            getChildTableList();
            getParentAuthTableList();
            getChildAuthTableList();
            alert('저장 되었습니다.');
        } else {
            console.log(responseDto.message)
        }
    }

    const del = async () => {
        if (!delValid()) return;
        const formData = new FormData(formRef.current);
        let requestDto = {};
        formData.forEach((value, key) => {
            requestDto[key] = value;
        })
        requestDto['authTypes'] = 'CRUD';
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('list'))}del`, JSON.stringify(requestDto));

        const responseDto = response.data;
        if (responseDto.code === 200) {
            getParentTableList();
            getChildTableList();
            getParentAuthTableList();
            getChildAuthTableList();
            alert('삭제 되었습니다.');
        } else {
            console.log(responseDto.message)
        }
    }

    const valid = () => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        let isValid = true;
        let isChecked = false;
        formData.forEach((value, key) => {
            if (key == 'authTypes') isChecked = true;
            let element = elements[key];
            if (isValid && element.required && !value) {
                if (key == 'managerSeq' || key == 'cmsMenuSeq') {
                    alert(`${element.title}를 선택해주세요.`);
                } else {
                    alert(`${element.title}(은)는 필수 요소 입니다.`);
                }
                isValid = false;
            }
        })
        if (!isChecked) {
            alert(`권한을 1개 이상 선택해주세요.`);
            isValid = false;
        }
        return isValid;
    }

    const delValid = () => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        let isValid = true;
        formData.forEach((value, key) => {
            let element = elements[key];
            if (isValid && !value) {
                if (key == 'managerSeq') {
                    alert(`${element.title}를 선택해주세요.`);
                    isValid = false;
                }
                if (key == 'managerAuthSeq') {
                    alert(`권한이 있는 메뉴를 선택해주세요.`);
                    isValid = false;
                }
            }
        })
        return isValid;
    }

    return <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            <MenuTitle leftMenuInfo={leftMenuInfo}/>

            <Table
                columnList={[
                    '관리자명',
                    '아이디(이메일)',
                    '관리자 상태',
                ]}
                leftMenuInfo={leftMenuInfo}
                isOnHeader={true}
                renderRowCallback={renderRows}
                isLoading={isLoadingOfManager}
            />

            <div className="row my-4">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-light fw-medium">현재 권한이 없는 상위 메뉴 입니다.</small>
                            </div>
                            <div>
                                <Table
                                    columnList={[
                                        '메뉴명',
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderParentRows}
                                    isLoading={isLoadingOfParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-light fw-medium">현재 권한이 없는 하위 메뉴 입니다.</small>
                            </div>
                            <div>
                                <Table
                                    columnList={[
                                        '메뉴명',
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderChildRows}
                                    isLoading={isLoadingOfChild}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-light fw-medium">현재 권한이 있는 상위 메뉴 입니다.</small>
                            </div>
                            <div>
                                <Table
                                    columnList={[
                                        '메뉴명',
                                        '권한'
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderParentAuthRows}
                                    isLoading={isLoadingOfAuthParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-light fw-medium">현재 권한이 있는 하위 메뉴 입니다.</small>
                            </div>
                            <div>
                                <Table
                                    columnList={[
                                        '메뉴명',
                                        '권한'
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderChildAuthRows}
                                    isLoading={isLoadingOfAuthChild}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card mb-4">
                    <div className="card-body">
                            <div className="mb-2">
                                <small className="text-light fw-medium">새로 고침 후 적용 됩니다.</small>
                            </div>
                            <form ref={formRef}>
                                <input name="cmsMenuSeq" type="hidden" title="메뉴" required={true}/>
                                <input name="managerSeq" id="managerSeq" type="hidden" title="관리자" required={true}/>
                                <input name="managerAuthSeq" id="managerAuthSeq" type="hidden"/>
                                <input name="authDir" id="authDir" type="hidden"/>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">관리자명</label>
                                    <div className="col-md-10">
                                        <label className="col-form-label" id="managerNm"></label></div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">메뉴명</label>
                                    <div className="col-md-10">
                                        <label className="col-form-label" id="menuNm"></label></div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">권한</label>
                                    <div className="col-md-10">
                                        <div className="form-check mb-2">
                                            <input name="authTypes" className="form-check-input" type="checkbox"
                                                   value="R" id="authTypesR" title="권한" required={true}/>
                                            <label className="form-check-label" htmlFor="authTypesR">
                                                조회
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input name="authTypes" className="form-check-input" type="checkbox"
                                                   value="C" id="authTypesC" title="권한" required={true}/>
                                            <label className="form-check-label" htmlFor="authTypesC">
                                                등록
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input name="authTypes" className="form-check-input" type="checkbox"
                                                   value="U" id="authTypesU" title="권한" required={true}/>
                                            <label className="form-check-label" htmlFor="authTypesU">
                                                수정
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input name="authTypes" className="form-check-input" type="checkbox"
                                                   value="D" id="authTypesD" title="권한" required={true}/>
                                            <label className="form-check-label" htmlFor="authTypesD">
                                                삭제
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex justify-content-around">
                                        <button type="button" className="btn btn-danger mx-2" onClick={del}>삭제</button>
                                        <button type="button" className="btn btn-primary" onClick={proc}>저장</button>
                                    </div>
                                </div>
                            </form>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

export default AuthMgmtListPage;