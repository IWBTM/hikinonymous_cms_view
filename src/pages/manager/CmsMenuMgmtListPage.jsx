import {useEffect, useRef, useState} from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import MenuTitle from "../../layout/MenuTitle";
import Pagination from "../../layout/Pagination";

const CmsMenuMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [ parentTableResult, setParentTableResultList ] = useState({});
    const [ childTableResult, setChildTableResultList ] = useState({});

    const [ isLoadingOfParent, setIsLoadingOfParent ] = useState(false);
    const [ isLoadingOfChild, setIsLoadingOfChild ] = useState(false);

    const searchParentFormRef = useRef();
    const searchChildFormRef = useRef();
    
    const formRef = useRef();

    useEffect(() => {
        getParentTableResultList();
    }, []);

    const clickParentRow = (e) => {
        const authDir = e.currentTarget.getAttribute('authDir')
        getChildTableList(authDir);

        const bindObj = e.currentTarget.getAttribute('bindObj')
        bindToWriteForm(JSON.parse(bindObj));
    }

    const clickChildRow = (e) => {
        const bindObj = e.currentTarget.getAttribute('bindObj')
        bindToWriteForm(JSON.parse(bindObj));
    }

    const bindToWriteForm = (bindObj) => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        formData.forEach((value, key) => {
            elements[key].value = bindObj[key];
        })
    }

    const clearWriteForm = (bindObj) => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        formData.forEach((value, key) => {

            if (elements[key].tagName == 'SELECT') {
                if (key.toLocaleUpperCase().indexOf('YN') > -1) {
                    elements[key].value = 'Y';
                } else {
                    elements[key].value = '1';
                }
            } else {
                elements[key].value = '';
            }

        })
    }

    const getParentTableResultList = async () => {
        setIsLoadingOfParent(true);
        const params = new URLSearchParams(new FormData(searchParentFormRef.current));
        const response = await api.get(`${filePath}/1?${params.toString()}`);
        setIsLoadingOfParent(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setParentTableResultList(responseData.data);
        }
    };

    const getChildTableList = async (authDir) => {
        setIsLoadingOfChild(true);
        const params = new URLSearchParams(new FormData(searchChildFormRef.current));
        const response = await api.get(`${filePath}/2?${params.toString()}&authDir=${authDir}`);
        setIsLoadingOfChild(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setChildTableResultList(responseData.data);
        }
    }

    const renderParentRows = () => {
        if (!parentTableResult.empty && parentTableResult.content) {
            return parentTableResult.content.map((row, index) => {
                let rowNum = parentTableResult.totalElements - (parentTableResult.number * parentTableResult.size) - (parentTableResult.numberOfElements) + (parentTableResult.content.length - index);
                return <tr className="cursor-pointer" id={row.managerSeq} authDir={row.authDir} bindObj={JSON.stringify(row)} onClick={clickParentRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.menuNm}</th>
                    <th scope="row">{row.authDir}</th>
                    <th scope="row">{row.filePath ? row.filePath : '-'}</th>
                    <th scope="row">{row.sortOrder}</th>
                </tr>;
            });
        }
    }

    const renderChildRows = () => {
        if (!childTableResult.empty && childTableResult.content) {
            return childTableResult.content.map((row, index) => {
                let rowNum = childTableResult.totalElements - (childTableResult.number * childTableResult.size) - (childTableResult.numberOfElements) + (childTableResult.content.length - index);
                return <tr className="cursor-pointer" id={row.managerSeq} bindObj={JSON.stringify(row)} onClick={clickChildRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.menuNm}</th>
                    <th scope="row">{row.authDir}</th>
                    <th scope="row">{row.filePath}</th>
                    <th scope="row">{row.sortOrder}</th>
                </tr>;
            });
        }
    }

    const addNewMenu = () => {
        clearWriteForm();
    }

    const proc = async () => {
        if (!valid()) return;
        const formData = new FormData(formRef.current);
        let requestDto = {};
        formData.forEach((value, key) => {
            requestDto[key] = value
        })
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}proc`, JSON.stringify(requestDto));

        const responseDto = response.data;
        if (responseDto.code === 200) {
            if (requestDto.menuLevel == 1) {
                getParentTableResultList();
            } else {
                getChildTableList(requestDto.authDir);
            }
            clearWriteForm();
            alert('저장 되었습니다.\n 저장된 메뉴는 새로 고침 후 적용 됩니다.');
        } else {
            console.log(responseDto.message)
        }
    }

    const valid = () => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        let isValid = true;
        formData.forEach((value, key) => {
            let element = elements[key];
            if (isValid && element.required && !value) {
                alert(`${element.title}(은)는 필수 요소 입니다.`);
                isValid = false;
            }
        })
        return isValid;
    }

    return <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            <MenuTitle leftMenuInfo={leftMenuInfo}/>

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form ref={searchParentFormRef}>
                                <input name="page" id="page" type="hidden"/>
                            </form>
                            <div>
                                <Table
                                    columnList={[
                                        '메뉴명',
                                        '폴더',
                                        '파일 경로',
                                        '순서',
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderParentRows}
                                    isLoading={isLoadingOfParent}
                                />

                                <Pagination tableResult={parentTableResult}
                                            getResultCallback={getParentTableResultList}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                <div className="card mb-4">
                        <div className="card-body">
                            <form ref={searchChildFormRef}>
                                <input name="page" id="page" type="hidden"/>
                            </form>
                            <div>
                                <Table
                                    columnList={[
                                        '메뉴명',
                                        '폴더',
                                        '파일 경로',
                                        '순서',
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderChildRows}
                                    isLoading={isLoadingOfChild}
                                />

                                <Pagination tableResult={childTableResult} getResultCallback={getChildTableList}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-light fw-medium">폴더가 같아야 상위/하위 메뉴 관계가 형성 됩니다.</small>
                            </div>
                            <form ref={formRef}>
                                <input name="cmsMenuSeq" type="hidden"/>
                                <input name="delYn" type="hidden"/>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">메뉴 레벨</label>
                                    <div className="col-md-10">
                                        <select id="defaultSelect" className="form-select" name="menuLevel"
                                                title="메뉴 레벨" required={true}>
                                            <option value="1">Parent</option>
                                            <option value="2">Child</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">메뉴명</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="menuNm" id="" title="메뉴명"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">메뉴 코드</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="menuCode" id="" title="메뉴 코드"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">폴더</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="authDir" id="" title="폴더"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">파일 경로</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="filePath" id="" title="파일 경로"/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">순서</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="number" name="sortOrder" id="" title="순서"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">설명</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="etc" id="" title="설명"/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">화면 여부</label>
                                    <div className="col-md-10">
                                        <select id="defaultSelect" className="form-select" name="displayYn"
                                                title="화면 여부" required={true}>
                                            <option value="Y">표시</option>
                                            <option value="N">미표시</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex justify-content-around">
                                        <button type="button" className="btn btn-secondary mx-1"
                                                onClick={addNewMenu}>추가
                                        </button>
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

export default CmsMenuMgmtListPage;