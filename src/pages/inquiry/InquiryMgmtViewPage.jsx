import MenuTitle from "../../layout/MenuTitle";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import api from "../../api/api";

const InquiryMgmtViewPage = ({leftMenuInfo}) => {

    const location = useLocation();
    const { seq, filePath } = location.state;

    const [ inquiryDto, setInquiryDto ] = useState({});

    const formRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        if (seq) getInquiryView();

    }, []);

    const getInquiryView = async () => {
        const response = await api.get(`${filePath}/${seq}`);
        const responseDto = response.data;
        if (responseDto.code === 200) {
            setInquiryDto(responseDto.data);
        }
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
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}updateAnswer`, JSON.stringify(requestDto));

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('발송 되었습니다.');
            getInquiryView();
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
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}updateDelYn`, {
            inquirySeq: seq,
            delYn: 'Y'
        });

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('삭제 되었습니다.');
            navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
        }
    }

    const downFile = (e) => {
        const getDownFile = async () => {
            const fileApiDownPath = e.currentTarget.getAttribute('fileApiDownPath');
            const fileName = e.currentTarget.getAttribute('fileName');
            const a = document.createElement('a');
            const response = await api.get(fileApiDownPath);
            const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
            a.href = fileUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(fileUrl);
        }
        getDownFile();
    }

    const renderFileDownBtn = () => {
        return inquiryDto.inquiryFileDtoList?.map(inquiryFileDto => {
            const fileDto = inquiryFileDto.fileDto;
            return <>
                        <label htmlFor="html5-text-input" className="col-md-2 col-form-label"></label>
                        <div className="col-md-10">
                            <button type="button" className="btn btn-dark mb-3" fileName={fileDto.fileOriNm} fileApiDownPath={`${fileDto.fileApiDownPath}${fileDto.fileInfoSeq}`}
                                    onClick={downFile}>[{fileDto.fileOriNm}] 다운로드
                            </button>
                        </div>
                   </>;
        })
    }

    return <div className="container-xxl flex-grow-1 container-p-y">
        <MenuTitle leftMenuInfo={leftMenuInfo}/>
        <div className="row">
            <div className="col-xl-12">
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="mb-3 row">
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">문의 타입</label>
                            <div className="col-md-10">
                                <label className="col-form-label">{inquiryDto.inquiryType?.codeNm}</label>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">제목</label>
                            <div className="col-md-10">
                                <label className="col-form-label">{inquiryDto.title}</label>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">내용</label>
                            <div className="col-md-10">
                                <label className="col-form-label">{inquiryDto.content}</label>
                            </div>
                        </div>
                        <div className={`mb-3 row ${inquiryDto.inquiryFileDtoList?.length > 0 ? 'd-none' : ''}`}>
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">파일</label>
                            <div className="col-md-10">
                                <label className="col-form-label">첨부된 파일이 없습니다.</label>
                            </div>
                        </div>
                        <div className={`mb-3 row ${inquiryDto.inquiryFileDtoList?.length > 0 ? '' : 'd-none'}`}>
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">파일</label>
                            <div className="col-md-10 mb-3">
                                <label className="col-form-label">총 {inquiryDto.inquiryFileDtoList?.length}개</label>
                            </div>
                            {renderFileDownBtn()}
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-date-input"
                                   className="col-md-2 col-form-label">작성자</label>
                            <div className="col-md-10">
                                <label className="col-form-label">{inquiryDto.registerNm}</label>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-date-input"
                                   className="col-md-2 col-form-label">작성일</label>
                            <div className="col-md-10">
                                <label className="col-form-label">{inquiryDto.regDate}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <div className={`mb-3 ${inquiryDto.answerYn == 'Y' ? 'd-none' : ''}`}>
                            <small className="text-light fw-medium">답장 시 해당 회원에게 메일 발송 됩니다.</small>
                        </div>
                        <form id="procForm" ref={formRef}>
                            <input name="inquirySeq" value={inquiryDto.inquirySeq} type="hidden"/>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">답장</label>
                                <div className="col-md-10">
                                    {
                                        inquiryDto.answerYn != 'Y' ?
                                            <input className="form-control" type="text" value={inquiryDto.answer}
                                                   id="html5-text-input" name="answer" title="답장" required={true}/> :
                                            <label className="col-form-label">{inquiryDto.answer}</label>
                                    }
                                </div>
                            </div>
                            <div className={`mb-3 row ${inquiryDto.answerYn != 'Y' ? 'd-none' : ''}`}>
                                <label htmlFor="html5-date-input"
                                       className="col-md-2 col-form-label">답장자</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{inquiryDto.answererNm}</label>
                                </div>
                            </div>
                            <div className={`mb-3 row ${inquiryDto.answerYn != 'Y' ? 'd-none' : ''}`}>
                                <label htmlFor="html5-date-input"
                                       className="col-md-2 col-form-label">답장일</label>
                                <div className="col-md-10">
                                    <label className="col-form-label">{inquiryDto.answerDate}</label>
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
                <button type="button" className="btn btn-danger mx-2" onClick={del}>삭제</button>
                <button type="button" className="btn btn-primary" onClick={proc}>저장</button>
            </div>
        </div>
    </div>;
}

export default InquiryMgmtViewPage;