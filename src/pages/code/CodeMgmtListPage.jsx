import {useEffect, useRef, useState} from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import MenuTitle from "../../layout/MenuTitle";

const CodeMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [ parentTableResult, setParentTableResultList ] = useState({});
    const [ childTableResult, setChildTableResultList ] = useState({});

    const [ isNew, setIsNew ] = useState(true);
    const [ isMaster, setIsMaster ] = useState(true);
    const [ bindObj, setBindObj ] = useState({});

    const [ isLoadingOfParent, setIsLoadingOfParent ] = useState(false);
    const [ isLoadingOfChild, setIsLoadingOfChild ] = useState(false);

    const formRef = useRef();

    useEffect(() => {
        getParentTableResultList();
    }, []);

    useEffect(() => {
        if (bindObj && bindObj.codeMaster) {
            setIsNew(false);
            bindToWriteForm(bindObj);
        } else {
            setIsNew(true);
        }
    }, [isMaster, bindObj]);


    const clickParentRow = (e) => {
        setIsMaster(true);
        setIsNew(true);

        const codeMaster = e.currentTarget.getAttribute('codeMaster');
        getChildTableList(codeMaster);

        const bindObj = e.currentTarget.getAttribute('bindObj');
        setBindObj(JSON.parse(bindObj));
    }

    const clickChildRow = (e) => {
        setIsMaster(false);
        setIsNew(true);

        const bindObj = e.currentTarget.getAttribute('bindObj');
        setBindObj(JSON.parse(bindObj));
    }

    const bindToWriteForm = (bindObj) => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        formData.forEach((value, key) => {
            if (bindObj[key]) elements[key].value = bindObj[key];
            else elements[key].value = '';
        })
    }

    const clearWriteForm = () => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        setIsNew(false);
        setBindObj({});
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
        const response = await api.get(`${filePath}`);
        setIsLoadingOfParent(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setParentTableResultList(responseData.data);
        }
    };

    const getChildTableList = async (codeMaster) => {
        setIsLoadingOfChild(true);
        const response = await api.get(`${filePath}?codeMaster=${codeMaster}`);
        setIsLoadingOfChild(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setChildTableResultList(responseData.data);
        }
    }

    const renderParentRows = () => {
        if (parentTableResult && parentTableResult.content) {
            return parentTableResult.content.map((row, index) => {
                let rowNum = (parentTableResult.totalElements - parentTableResult.totalPages) * (parentTableResult.number + index + 1);
                return <tr className="cursor-pointer" id={row.codeMaster} codeMaster={row.codeMaster} bindObj={JSON.stringify(row)} onClick={clickParentRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.codeMaster}</th>
                    <th scope="row">{row.codeMasterNm}</th>
                </tr>;
            }).reverse();
        }
    }

    const renderChildRows = () => {
        if (childTableResult && childTableResult.content) {
            return childTableResult.content.map((row, index) => {
                let rowNum = (childTableResult.totalElements - childTableResult.totalPages) * (childTableResult.number + index + 1);
                return <tr className="cursor-pointer" id={row.codeSeq} bindObj={JSON.stringify(row)} onClick={clickChildRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.code}</th>
                    <th scope="row">{row.codeNm}</th>
                    <th scope="row">{row.sortOrder}</th>
                </tr>;
            }).reverse();
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
        requestDto['codeMaster'] = document.getElementById('codeMaster').value;
        let url = filePath.substring(0, filePath.lastIndexOf('view'));
        if (isMaster) {
            url += 'codeMaster/proc'
        } else {
            url += 'code/proc'
        }
        const response = await api.post(url, JSON.stringify(requestDto));

        const responseDto = response.data;
        if (responseDto.code === 200) {
            if (requestDto.codeLevel == 1) {
                getParentTableResultList();
            } else {
                getChildTableList(requestDto.codeMaster);
            }
            clearWriteForm();
            alert('저장 되었습니다.');
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

    const handelIsMaster = (e) => {
        if (e.currentTarget.id == 'master') {
            setIsMaster(true);
        } else {
            setIsMaster(false);
        }
    }

    const del = async () => {
        if (isMaster) {
            const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('list'))}codeMaster/updateDelYn`, {
                codeMaster: document.getElementById('codeMaster').value,
                delYn: 'Y'
            });
            const responseDto = response.data;
            if (responseDto.code === 200) {
                alert('삭제 되었습니다.');
                getParentTableResultList();
            }
        } else {
            const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('list'))}code/updateDelYn`, {
                codeSeq: bindObj.codeSeq,
                delYn: 'Y'
            });
            const responseDto = response.data;
            if (responseDto.code === 200) {
                alert('삭제 되었습니다.');
                getChildTableList(bindObj.codeMaster);
            }
        }
    }

    return <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            <MenuTitle leftMenuInfo={leftMenuInfo}/>

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div>
                                <Table
                                    columnList={[
                                        '코드 마스터',
                                        '코드명',
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
                            <div>
                                <Table
                                    columnList={[
                                        '코드',
                                        '코드명',
                                        '순서',
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

                <div className="col-xl-12">
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="mb-2">
                            <small className="text-light fw-medium">코드 마스터가 같아야 상위/하위 코드 관계가 형성됩니다.</small>
                        </div>
                        <div className="form-check mb-2 col-md-12">
                            <input name="authTypes" className="form-check-input col-md-1" type="radio"
                                   value="Y" id="master" checked={isMaster} onClick={handelIsMaster}/>
                            <label className="form-check-label col-md-2" htmlFor="master">
                                마스터
                            </label>
                        </div>
                        <div className="form-check mb-2 col-md-12">
                            <input name="authTypes" className="form-check-input col-md-1" type="radio"
                                   value="N" id="general" checked={!isMaster} onClick={handelIsMaster}/>
                            <label className="form-check-label col-md-2" htmlFor="general">
                                일반
                            </label>
                        </div>
                        {
                            isMaster ?
                                <form ref={formRef}>
                                    <input name="cmsMenuSeq" type="hidden"/>
                                    <input name="delYn" type="hidden"/>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input" className="col-md-2 col-form-label">코드
                                            마스터</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="text" name="codeMaster" id="codeMaster"
                                                   disabled={!isNew}/>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input"
                                               className="col-md-2 col-form-label">코드명</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="text" name="codeMasterNm" id=""
                                                   title="코드명"
                                                   required={true}/>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input"
                                               className="col-md-2 col-form-label">설명</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="text" name="etc" id=""
                                                   title="설명"/>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input"
                                               className="col-md-2 col-form-label">순서</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="number" name="sortOrder" id=""
                                                   title="순서"
                                                   required={true}/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <div className="d-flex justify-content-around">
                                            <button type="button" className="btn btn-secondary mx-1"
                                                    onClick={addNewMenu}>추가
                                            </button>
                                            <button type="button"
                                                    className={`btn btn-warning mx-1 ${isNew ? 'd-none' : ''}`}
                                                    onClick={del}>삭제
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={proc}>저장
                                            </button>
                                        </div>
                                    </div>
                                </form> :
                                <form ref={formRef}>
                                    <input name="cmsMenuSeq" type="hidden"/>
                                    <input name="delYn" type="hidden"/>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input" className="col-md-2 col-form-label">코드
                                            마스터</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="text" name="codeMaster" id="codeMaster"
                                                   title="코드 마스터"
                                                   required={true}
                                                   disabled={!isNew}/>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input"
                                               className="col-md-2 col-form-label">코드</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="text" name="code" id=""
                                                   title="코드"
                                                   required={true}/>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input"
                                               className="col-md-2 col-form-label">코드명</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="text" name="codeNm" id=""
                                                   title="코드명"
                                                   required={true}/>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input"
                                               className="col-md-2 col-form-label">설명</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="text" name="etc" id=""
                                                   title="설명"/>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input"
                                               className="col-md-2 col-form-label">순서</label>
                                        <div className="col-md-10">
                                            <input className="form-control" type="number" name="sortOrder" id=""
                                                   title="순서"
                                                   required={true}/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <div className="d-flex justify-content-around">
                                            <button type="button" className="btn btn-secondary mx-1"
                                                    onClick={addNewMenu}>추가
                                            </button>
                                            <button type="button"
                                                    className={`btn btn-warning mx-1 ${isNew ? 'd-none' : ''}`}
                                                    onClick={del}>삭제
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={proc}>저장
                                            </button>
                                        </div>
                                    </div>
                                </form>
                        }
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>;
}

export default CodeMgmtListPage;