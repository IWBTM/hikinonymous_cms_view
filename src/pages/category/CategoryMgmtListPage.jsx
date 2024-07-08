import {useEffect, useRef, useState} from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import MenuTitle from "../../layout/MenuTitle";

const CategoryMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [ parentTableResult, setParentTableResultList ] = useState({});
    const [ registerDto, setRegisterDto ] = useState({});

    const formRef = useRef();

    useEffect(() => {

        getParentTableResultList();
    }, []);

    const clickParentRow = (e) => {
        const bindObj = e.currentTarget.getAttribute('bindObj')
        bindToWriteForm(JSON.parse(bindObj));
    }

    const bindToWriteForm = (bindObj) => {
        const formData = new FormData(formRef.current);
        const elements = formRef.current.elements;
        formData.forEach((value, key) => {
            elements[key].value = bindObj[key];
        })

        setRegisterDto({
            regDate: bindObj['regDate'],
            registerNm: bindObj['registerNm'],
            isBind: true
        });
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

        setRegisterDto({});
    }

    const getParentTableResultList = async () => {
        const response = await api.get(`${filePath}/1`);
        const responseData = response.data;
        if (responseData.code === 200) {
            setParentTableResultList(responseData.data);
        }
    };

    const renderParentRows = () => {
        if (!parentTableResult.empty && parentTableResult.content) {
            return parentTableResult.content.map((row, index) => {
                let rowNum = (parentTableResult.totalElements - parentTableResult.totalPages) * (parentTableResult.number + index + 1);
                return <tr className="cursor-pointer" id={row.categorySeq} bindObj={JSON.stringify(row)}
                           onClick={clickParentRow} key={index}>
                    <th scope="row">{rowNum}</th>
                    <th scope="row">{row.categoryName}</th>
                    <th scope="row">{row.categoryLevel}</th>
                    <th scope="row">{row.useYn}</th>
                    <th scope="row">{row.sortOrder}</th>
                    <th scope="row">{row.regDate}</th>
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
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}proc`, JSON.stringify(requestDto));

        const responseDto = response.data;
        if (responseDto.code === 200) {
            getParentTableResultList();
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
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div>
                                <Table
                                    columnList={[
                                        '카테고리명',
                                        '레벨',
                                        '사용 여부',
                                        '순서',
                                        '생성일'
                                    ]}
                                    leftMenuInfo={leftMenuInfo}
                                    isOnHeader={false}
                                    renderRowCallback={renderParentRows}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-light fw-medium">폴더가 같아야 상위/하위 카테고리 관계가 형성 됩니다.</small>
                            </div>
                            <form ref={formRef}>
                                <input name="categorySeq" type="hidden"/>
                                <input name="delYn" type="hidden"/>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">카테고리
                                        레벨</label>
                                    <div className="col-md-10">
                                        <select id="defaultSelect" className="form-select" name="categoryLevel"
                                                title="카테고리 레벨" required={true}>
                                            <option value="1">Parent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">카테고리명</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="categoryName" id=""
                                               title="카테고리명"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">설명</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="etc" id=""
                                               title="설명"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">순서</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name="sortOrder" id="" title="순서"
                                               required={true}/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-2 col-form-label">사용 여부</label>
                                    <div className="col-md-10">
                                        <select id="defaultSelect" className="form-select" name="useYn"
                                                title="사용 여부" required={true}>
                                            <option value="Y">사용</option>
                                            <option value="N">미사용</option>
                                        </select>
                                    </div>
                                </div>
                                {
                                    registerDto.isBind ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-text-input" className="col-md-2 col-form-label">등록일</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{registerDto?.regDate}</label>
                                        </div>
                                    </div> : ''
                                }
                                {
                                    registerDto.isBind ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input"
                                               className="col-md-2 col-form-label">등록자</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{registerDto?.registerNm}</label>
                                        </div>
                                    </div> : ''
                                }
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

export default CategoryMgmtListPage;