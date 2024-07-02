import MenuTitle from "../../layout/MenuTitle";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import getCodeListByCodeMaster from "../../api/common/getCode";
import api from "../../api/api";

const BannerMgmtViewPage = ({leftMenuInfo}) => {

    const location = useLocation();
    const { seq, filePath } = location.state;

    const [ positionList, setPositionList ] = useState([]);
    const [ bannerDto, setBannerDto ] = useState({});

    const [ pwdChangeStep, setPwdChangeStep ] = useState(0);
    const [ isValidPwd, setIsValidPwd ] = useState(true);

    const formRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        const getPositionList = async () => {
            setPositionList(await getCodeListByCodeMaster('BANNER_POSITION'));
        }

        const getBannerView = async () => {
            const response = await api.get(`${filePath}/${seq}`);
            const responseDto = response.data;
            if (responseDto.code === 200) {
                setBannerDto(responseDto.data);
            }
        }

        getPositionList();
        if (seq) getBannerView();
    }, []);

    const goList = () => {
        navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
    }

    const del = async () => {
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}updateDelYn`, {
            bannerSeq: seq,
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
                            <input name="bannerSeq" value={bannerDto.bannerSeq} type="hidden"/>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">배너명</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" value={bannerDto.title}
                                           id="html5-text-input" name="title" title="배너명" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-search-input" className="col-md-2 col-form-label">배너 위치</label>
                                <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                        aria-label="Default select example" name="positionSeq" title="배너 위치"
                                        required={true}>
                                    <option selected={!bannerDto.position && true} value="">선택 해주세요.</option>
                                    ;
                                    {
                                        positionList && positionList.map((position, index) => {
                                            return <option
                                                selected={bannerDto.position && bannerDto.position.codeSeq == position.codeSeq}
                                                key={index}
                                                value={position.codeSeq}>{position.codeNm}
                                            </option>;
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">설명</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" value={bannerDto.etc}
                                           id="html5-text-input" name="etc" title="설명" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">LINK URL</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" value={bannerDto.url}
                                           id="html5-text-input" name="url" title="LINK URL" required={true}/>
                                </div>
                            </div>
                            <div className="mb-5 row">
                                <label htmlFor="html5-search-input" className="col-md-2 col-form-label">사용 여부</label>
                                <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                        aria-label="Default select example" name="useYn" title="사용 여부" required={true}>
                                    <option selected={bannerDto.useYn == 'Y'} value='Y'>사용</option>
                                    <option selected={bannerDto.useYn == 'N'} value='N'>미사용</option>
                                </select>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="formFile" className="col-md-2 form-label">PC 이미지</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="file" id="pcImage"/>
                                </div>
                            </div>
                            <div className={`${seq ? 'mb-5' : 'mb-2'} row`}>
                                <label htmlFor="formFile" className="col-md-2 form-label">MOBILE 이미지</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="file" id="moImage"/>
                                </div>
                            </div>

                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input"
                                               className="col-md-2 col-form-label">등록일</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{bannerDto.regDate}</label>
                                        </div>
                                    </div> : ''
                            }
                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input"
                                               className="col-md-2 col-form-label">등록자</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{bannerDto.register.managerNm}</label>
                                        </div>
                                    </div> : ''
                            }
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

export default BannerMgmtViewPage;