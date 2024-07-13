import MenuTitle from "../../layout/MenuTitle";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import getCodeListByCodeMaster from "../../api/common/getCode";
import api from "../../api/api";

const MemberMgmtViewPage = ({leftMenuInfo, authTypes})  => {

    const location = useLocation();
    const { seq, filePath } = location.state;

    const [ memberStatusList, setMemberStatusList ] = useState([]);
    const [ memberDto, setMemberDto ] = useState({});

    const formRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        if (seq) getMemberView();

    }, []);

    const getMemberView = async () => {
        const response = await api.get(`${filePath}/${seq}`);
        const responseDto = response.data;
        if (responseDto.code === 200) {
            setMemberDto(responseDto.data);
            getMemberStatusList();
        }
    }

    const getMemberStatusList = async () => {
        setMemberStatusList(await getCodeListByCodeMaster('MEMBER_STATUS'));
    }

    const goList = () => {
        navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
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

    return <div className="container-xxl flex-grow-1 container-p-y">
        <MenuTitle leftMenuInfo={leftMenuInfo}/>
        <div className="row">
            <div className="col-xl-12">
                <div className="card mb-4">
                    <div className="card-body">
                        <form id="procForm" ref={formRef}>
                            <input name="memberSeq" value={memberDto.memberSeq} type="hidden"/>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">회원명</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.memberName}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">별명</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.memberNickName}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">이메일</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.memberEmail}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">연락처</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.memberHp}</label>
                                </div>
                            </div>
                            <div className="mb-5 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">가입 경로</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.joinType?.codeNm}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">누적 신고 횟수</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.reportCnt}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">작성한 게시글 수</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.totalBoardCnt}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">작성한 댓글 수</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.totalReplyCnt}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-search-input" className="col-md-2 col-form-label">회원 상태</label>
                                <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                        aria-label="Default select example" name="memberStatusSeq" title="회원 상태"
                                        required={true}>
                                    <option selected={!memberDto.memberStatus && true} value="">선택 해주세요.</option>
                                    ;
                                    {
                                        memberStatusList && memberStatusList.map((memberStatus, index) => {
                                            return <option
                                                selected={memberDto.memberStatus && memberDto.memberStatus.codeSeq == memberStatus.codeSeq}
                                                key={index}
                                                value={memberStatus.codeSeq}>{memberStatus.codeNm}
                                            </option>;
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">메모</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" defaultValue={memberDto.memo}
                                           id="html5-text-input" name="memo"/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-date-input"
                                       className="col-md-2 col-form-label">마지막 로그인일</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.lastLoginDate}</label>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-date-input"
                                       className="col-md-2 col-form-label">가입일</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{memberDto.regDate}</label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={goList}>리스트</button>
            <div className="d-flex justify-content-around">
                <button type="button" className="btn btn-primary" onClick={proc}>저장</button>
            </div>
        </div>
    </div>;
}

export default MemberMgmtViewPage;