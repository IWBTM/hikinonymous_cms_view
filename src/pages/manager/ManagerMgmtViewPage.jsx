import MenuTitle from "../../layout/MenuTitle";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import getCodeListByCodeMaster from "../../api/common/getCode";
import api from "../../api/api";

const ManagerMgmtViewPage = ({leftMenuInfo, authTypes})  => {

    const location = useLocation();
    const { seq, filePath } = location.state;

    const [ managerStatusList, setManagerStatusList ] = useState([]);
    const [ managerDto, setManagerDto ] = useState({});

    const [ pwdChangeStep, setPwdChangeStep ] = useState(0);
    const [ isValidPwd, setIsValidPwd ] = useState(true);
    const [ isChangedValidPwd, setIsChangedValidPwd ] = useState(false);

    const formRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        const getManagerStatusList = async () => {
            setManagerStatusList(await getCodeListByCodeMaster('MANAGER_STATUS'));
        }

        const getManagerView = async () => {
            const response = await api.get(`${filePath}/${seq}`);
            const responseDto = response.data;
            if (responseDto.code === 200) {
                setManagerDto(responseDto.data);
            }
        }

        getManagerStatusList();
        if (seq) getManagerView();
    }, []);

    const goList = () => {
        navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
    }

    const del = async () => {
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}updateDelYn`, {
            managerSeq: seq,
            delYn: 'Y'
        });

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('삭제 되었습니다.');
            navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
        }
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
            alert('저장 되었습니다.');
            navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
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

        if (pwdChangeStep == 1 && !isValidPwd) {
            isValid = false;
            alert('비밀번호를 확인해주세요.');
        }
        return isValid;
    }

    const validPwd = (e) => {
        const target = e.currentTarget;
        if (target.value.length > 0) {
            if (target.value !== document.getElementById('newPwd').value) {
                setIsValidPwd(false);
            } else {
                setIsValidPwd(true);
            }
            setIsChangedValidPwd(true);
        }
    }

    const goStep = (e) => {
        const step = e.currentTarget.value;
        setPwdChangeStep(step);
    }

    return <div className="container-xxl flex-grow-1 container-p-y">
        <MenuTitle leftMenuInfo={leftMenuInfo}/>
        <div className="row">
            <div className="col-xl-12">
                <div className="card mb-4">
                    <div className="card-body">
                        <form id="procForm" ref={formRef}>
                            <input name="managerSeq" value={managerDto.managerSeq} type="hidden"/>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">이름</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" value={managerDto.managerNm}
                                           id="html5-text-input" name="managerNm" title="이름" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-email-input" className="col-md-2 col-form-label">Email</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="email" value={managerDto.managerId}
                                           id="html5-email-input" name="managerId" title="Email" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-tel-input" className="col-md-2 col-form-label">Phone</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="tel" value={managerDto.managerHp}
                                           id="html5-tel-input" name="managerHp" title="Phone" required={true}/>
                                </div>
                            </div>
                            {
                                seq && pwdChangeStep == 0 ?
                                <div className="mb-3 row">
                                    <label htmlFor="html5-tel-input" className="col-md-2 col-form-label">비밀번호</label>
                                    <div className="col-md-2 mb-2">
                                        <button type="button" className="btn btn-info" value={1} onClick={goStep}>변경</button>
                                    </div>
                                </div> : ''
                            }
                            {
                                !seq || pwdChangeStep == 1 ?
                                    <div className="mb-1 row changePwdArea">
                                        <label htmlFor="html5-tel-input" className="col-md-2 col-form-label">{!seq ? '비밀번호' : '새로운 비밀번호'}</label>
                                        <div className="col-md-10 mb-2">
                                            <input className="form-control" type="password"
                                                   id="newPwd" name="managerPwd" title="비밀번호" required={true}/>
                                        </div>
                                    </div> : ''
                            }
                            {
                                !seq || pwdChangeStep == 1 ?
                                    <div className="mb-3 row changePwdArea">
                                        <label htmlFor="html5-tel-input" className="col-md-2 col-form-label"></label>
                                        <div className="col-md-10 mb-2">
                                            <input className={'form-control' + (!isValidPwd ? ' btn-outline-danger' : '')} type="password"
                                                   id="html5-tel-input" name="managerPwdConfirm" title="비밀번호" required={true}
                                                    onChange={validPwd}/>
                                        </div>
                                    </div> : ''
                            }

                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-password-input" className="col-md-2 col-form-label">로그인
                                            횟수</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{managerDto.loginCnt}회</label>
                                        </div>
                                    </div> : ''
                            }
                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-number-input" className="col-md-2 col-form-label">로그인 실패
                                            횟수</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{managerDto.loginFailCnt}회</label>
                                        </div>
                                    </div> : ''
                            }
                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input" className="col-md-2 col-form-label">마지막 로그인
                                            일</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{managerDto.lastLoginDate}</label>
                                        </div>
                                    </div> : ''
                            }
                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input" className="col-md-2 col-form-label">등록일</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{managerDto.regDate}</label>
                                        </div>
                                    </div> : ''
                            }
                            <div className="mb-3 row">
                                <label htmlFor="html5-search-input" className="col-md-2 col-form-label">관리자 상태</label>
                                <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                        aria-label="Default select example" name="managerStatusSeq" title="관리자 상태"
                                        required={true}>
                                    {
                                        managerStatusList.map((managerStatus, index) => {
                                            return <option
                                                        selected={managerDto.managerStatusSeq == managerStatus.codeSeq}
                                                        key={index}
                                                        value={managerStatus.codeSeq}>{managerStatus.codeNm}
                                                    </option>;
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-search-input" className="col-md-2 col-form-label">사용 여부</label>
                                <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                        aria-label="Default select example" name="useYn" title="사용 여부" required={true}>
                                    <option selected={managerDto.useYn == 'Y'} value='Y'>사용</option>
                                    <option selected={managerDto.useYn == 'N'} value='N'>미사용</option>
                                </select>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-search-input" className="col-md-2 col-form-label">슈퍼 관리자
                                    여부</label>
                                <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                        aria-label="Default select example" name="superYn" title="슈퍼 관리자 여부"
                                        required={true}>
                                    <option selected={managerDto.superYn == 'Y'} value='Y'>슈퍼 관리자</option>
                                    <option selected={managerDto.superYn == 'N'} value='N'>일반 관리자</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={goList}>리스트</button>
            <div className="d-flex justify-content-around">
                {
                    seq ?
                        <button type="button" className="btn btn-warning mx-1" onClick={del}>삭제</button> : ''
                }
                <button type="button" className="btn btn-primary" onClick={proc}>저장</button>
            </div>
        </div>
    </div>;
}

export default ManagerMgmtViewPage;