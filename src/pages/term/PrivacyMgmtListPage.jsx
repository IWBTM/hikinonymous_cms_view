import {useEffect, useRef, useState} from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import MenuTitle from "../../layout/MenuTitle";
import Pagination from "../../layout/Pagination";

const PrivacyMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [ parentTableResult, setParentTableResultList ] = useState({});

    const [ isExist, setIsExist ] = useState(false);
    const [ bindObj, setBindObj ] = useState('');

    const [ isLoadingOfParent, setIsLoadingOfParent ] = useState(false);

    const formRef = useRef();
    const searchFormRef = useRef();

    useEffect(() => {
        getParentTableResultList();
    }, []);

    useEffect(() => {
        if (bindObj) {
            bindToWriteForm(bindObj);
        }
    }, [isExist, bindObj]);

    const clickParentRow = (e) => {
        setIsExist(true);

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
        document.getElementById('registerNm').innerText = bindObj['registerNm'];
        document.getElementById('regDate').innerText = bindObj['regDate'];

        // if (bindObj['updDate']) {
        //     document.getElementById('updaterNm').innerText = bindObj['updaterNm'];
        //     document.getElementById('updDate').innerText = bindObj['updDate'];
        // }
    }

    const clearWriteForm = () => {
        setIsExist(false);
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

        document.getElementById('registerNm').innerText = '';
        document.getElementById('regDate').innerText = '';

        // document.getElementById('updaterNm').innerText = '';
        // document.getElementById('updDate').innerText = '';
    }

    const getParentTableResultList = async () => {
        setIsLoadingOfParent(true);
        const params = new URLSearchParams(new FormData(searchFormRef.current));
        const response = await api.get(`${filePath}?${params.toString()}`);
        setIsLoadingOfParent(false);
        const responseData = response.data;
        if (responseData.code === 200) {
            setParentTableResultList(responseData.data);
        }
    };

    const renderParentRows = () => {
        if (parentTableResult && parentTableResult.content) {
            return parentTableResult.content.map((row, index) => {
                let rowNum = parentTableResult.totalElements - (parentTableResult.number * parentTableResult.size) - (parentTableResult.numberOfElements) + (parentTableResult.content.length - index);
                return <tr className="cursor-pointer" id={row.serviceBoardSeq} bindObj={JSON.stringify(row)}
                           onClick={clickParentRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.title}</th>
                    <th scope="row">{row.content}</th>
                    <th scope="row">{row.useYn == 'Y' ? '사용' : '미사용'}</th>
                    <th scope="row">{row.regDate}</th>
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
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('list'))}proc`, JSON.stringify(requestDto));

        const responseDto = response.data;
        if (responseDto.code === 200) {
            getParentTableResultList();
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

    const del = async () => {
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('list'))}updateDelYn`, {
            serviceBoardSeq: bindObj.serviceBoardSeq,
            delYn: 'Y'
        });

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('삭제 되었습니다.');
            getParentTableResultList();
        }
    }

    return <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            <MenuTitle leftMenuInfo={leftMenuInfo}/>

            <div className="row">
                <div className="col-md-12 mb-2">
                    <div className="card mb-12">
                        <div className="card-body">
                            <form ref={searchFormRef}>
                                <input name="page" id="page" type="hidden"/>
                            </form>
                            <div>
                                <Table
                                    columnList={[
                                        '제목',
                                        '내용',
                                        '사용 여부',
                                        '등록일',
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderParentRows}
                                    isLoading={isLoadingOfParent}
                                />
                            </div>
                        </div>
                    </div>
                    <Pagination tableResult={parentTableResult} getResultCallback={getParentTableResultList}/>
                </div>

                <div className="col-xl-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form ref={formRef}>
                                <input name="serviceBoardSeq" type="hidden"/>
                                <input name="delYn" type="hidden"/>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">제목</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="title" id="" title="제목"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">내용</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="content" id="" title="내용"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-search-input" className="col-md-2 col-form-label">사용
                                        여부</label>
                                    <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                            aria-label="Default select example" name="useYn" title="사용 여부"
                                            required={true}>
                                        <option value='Y'>사용</option>
                                        <option value='N'>미사용</option>
                                    </select>
                                </div>

                                <div className={`mb-3 row ${isExist ? '' : 'd-none'}`}>
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">등록자명</label>
                                    <div className="col-md-10">
                                        <label className="col-form-label" id="registerNm"></label>
                                    </div>
                                </div>
                                <div className={`mb-3 row ${isExist ? '' : 'd-none'}`}>
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">등록일</label>
                                    <div className="col-md-10">
                                        <label className="col-form-label" id="regDate"></label>
                                    </div>
                                </div>

                                {/*<div className={`mb-3 row ${isExist ? '' : 'd-none'}`}>*/}
                                {/*    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">수정자명</label>*/}
                                {/*    <div className="col-md-10">*/}
                                {/*        <label className="col-form-label" id="updaterNm"></label>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={`mb-3 row ${isExist ? '' : 'd-none'}`}>*/}
                                {/*    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">수정일</label>*/}
                                {/*    <div className="col-md-10">*/}
                                {/*        <label className="col-form-label" id="updDate"></label>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex justify-content-around">
                                        <button type="button" className="btn btn-secondary mx-1"
                                                onClick={addNewMenu}>추가
                                        </button>
                                        <button type="button"
                                                className={`btn btn-warning mx-1 ${!isExist ? 'd-none' : ''}`}
                                                onClick={del}>삭제
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={proc}>저장
                                        </button>
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

export default PrivacyMgmtListPage;