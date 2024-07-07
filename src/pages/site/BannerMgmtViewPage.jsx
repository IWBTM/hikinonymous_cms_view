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

    const [ selectedPcImageFile, setSelectedPcImageFile ] = useState({});
    const [ selectedMoImageFile, setSelectedMoImageFile ] = useState({});

    const formRef = useRef();

    const navigate = useNavigate();

    let imageDelSeqList = [];

    useEffect(() => {
        const getPositionList = async () => {
            setPositionList(await getCodeListByCodeMaster('BANNER_POSITION'));
        }

        getPositionList();
        if (seq) getBannerView();
    }, []);

    const getBannerView = async () => {
        const response = await api.get(`${filePath}/${seq}`);
        const responseDto = response.data;
        if (responseDto.code === 200) {
            setSelectedPcImageFile({
                filePath: `${responseDto.data.pcImage.fileApiPath}${responseDto.data.pcImage.fileInfoSeq}`,
                fileNm: responseDto.data.pcImage.fileOriNm,
                fileInfoSeq: responseDto.data.pcImage.fileInfoSeq,
                isExist: true
            });
            setSelectedMoImageFile({
                filePath: `${responseDto.data.moImage.fileApiPath}${responseDto.data.moImage.fileInfoSeq}`,
                fileNm: responseDto.data.moImage.fileOriNm,
                fileInfoSeq: responseDto.data.moImage.fileInfoSeq,
                isExist: true
            });
            setBannerDto(responseDto.data);
        }
    }

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
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}proc`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

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

            const keyLowerCase = key.toLowerCase();
            if (isValid && element.required && keyLowerCase.indexOf('image') > -1) {
                if (keyLowerCase.indexOf('pc') > -1) {
                    if (!value.size && !selectedPcImageFile.isExist) {
                        alert(`${element.title}(은)는 필수 요소 입니다.`);
                        isValid = false;
                    }
                }

                if (keyLowerCase.indexOf('mo') > -1) {
                    if (!value.size && !selectedMoImageFile.isExist) {
                        alert(`${element.title}(은)는 필수 요소 입니다.`);
                        isValid = false;
                    }
                }
            }
        })

        return isValid;
    }

    const changedFile = (e) => {
        const id = e.currentTarget.id;
        const deviceType = id.substring(0, id.indexOf('ImageFile'));

        const file = e.currentTarget.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                if (deviceType == 'pc') setSelectedPcImageFile({filePath: e.target.result, fileNm: file.name, fileInfoSeq: null, isExist: true});
                if (deviceType == 'mo') setSelectedMoImageFile({filePath: e.target.result, fileNm: file.name, fileInfoSeq: null, isExist: true});
            }
            reader.readAsDataURL(file);
        }
    }

    const delImage = (e) => {
        const id = e.currentTarget.id.toLowerCase();

        if (id.indexOf('pc') > -1) {
            setSelectedPcImageFile({});
            document.getElementById('pcImageFile').value = null;
        } else if (id.indexOf('mo') > -1) {
            setSelectedMoImageFile({});
            document.getElementById('moImageFile').value = null;
        }

        imageDelSeqList.push(e.currentTarget.value);
    }

    return <div className="container-xxl flex-grow-1 container-p-y">
        <MenuTitle leftMenuInfo={leftMenuInfo}/>
        <div className="row">
            <div className="col-xl-12">
                <div className="card mb-4">
                    <div className="card-body">
                        <form id="procForm" ref={formRef}>
                            <input name="bannerSeq" value={bannerDto.bannerSeq} type="hidden"/>
                            <input name="imageDelSeq" id="imageDelSeq" type="hidden"/>
                            <input name="delYn" type="hidden" value={bannerDto.delYn}/>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">배너명</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" defaultValue={bannerDto.title}
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
                                    <input className="form-control" type="text" defaultValue={bannerDto.etc}
                                           id="html5-text-input" name="etc" title="설명" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">LINK URL</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" defaultValue={bannerDto.url}
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
                                    {
                                        selectedPcImageFile.fileNm ?
                                            <label
                                                className="col-form-label mx-2">{selectedPcImageFile.fileNm} </label> : ''
                                    }
                                    {
                                        selectedPcImageFile.fileNm ?
                                            <button type="button" value={selectedPcImageFile.fileInfoSeq}
                                                    className="btn btn-danger mx-1 mb-sm-2" id="delPcImageBtn"
                                                    onClick={delImage}>삭제</button> : ''
                                    }
                                            <input className={`form-control ${selectedPcImageFile.isExist ? 'd-none' : ''}`} type="file" id="pcImageFile"
                                                   name="pcImageFile" title="PC 이미지" required={true}
                                                   onChange={changedFile}/>
                                    <img src={selectedPcImageFile.filePath}
                                         className={`w-100 my-3 ${!selectedPcImageFile.fileNm ? "d-none" : ""}`}/>
                                </div>
                            </div>
                            <div className={`${seq ? 'mb-5' : 'mb-2'} row`}>
                                <label htmlFor="formFile" className="col-md-2 form-label">MOBILE 이미지</label>
                                <div className="col-md-10">
                                    {
                                        selectedMoImageFile.fileNm ?
                                            <label
                                                className="col-form-label mx-2">{selectedMoImageFile.fileNm} </label> : ''
                                    }
                                    {
                                        selectedMoImageFile.fileNm ?
                                            <button type="button" value={selectedMoImageFile.fileInfoSeq}
                                                    className="btn btn-danger mx-1 mb-sm-2" id="delMoImageBtn"
                                                    onClick={delImage}>삭제</button> : ''
                                    }
                                            <input className={`form-control ${selectedMoImageFile.isExist ? 'd-none' : ''}`} type="file" id="moImageFile"
                                                   name="moImageFile" title="MOBILE 이미지" required={true}
                                                   onChange={changedFile}/>
                                    <img src={selectedMoImageFile.filePath}
                                         className={`w-100 my-3 ${!selectedMoImageFile.fileNm ? "d-none" : ""}`}/>
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
                                            <label className="col-form-label">{bannerDto.registerNm}</label>
                                        </div>
                                    </div> : ''
                            }

                            {
                                seq && bannerDto.updaterNm ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input"
                                               className="col-md-2 col-form-label">수정일</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{bannerDto.updDate}</label>
                                        </div>
                                    </div> : ''
                            }
                            {
                                seq && bannerDto.updaterNm ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input"
                                               className="col-md-2 col-form-label">수정자</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{bannerDto.updaterNm}</label>
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