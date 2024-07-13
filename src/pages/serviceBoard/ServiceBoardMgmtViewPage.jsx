import MenuTitle from "../../layout/MenuTitle";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import getCodeListByCodeMaster from "../../api/common/getCode";
import api from "../../api/api";

const ServiceBoardMgmtViewPage = ({leftMenuInfo, authTypes})  => {

    const location = useLocation();
    const { seq, filePath } = location.state;

    const [ serviceBoardDto, setServiceBoardDto ] = useState({});

    const [ selectedPcThumbImageFile, setSelectedPcThumbImageFile ] = useState({});
    const [ selectedMoThumbImageFile, setSelectedMoThumbImageFile ] = useState({});

    const [ selectedPcMainImageFile, setSelectedPcMainImageFile ] = useState({});
    const [ selectedMoMainImageFile, setSelectedMoMainImageFile ] = useState({});

    const formRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        if (seq) getServiceBoardView();

    }, []);

    const getServiceBoardView = async () => {
        const response = await api.get(`${filePath}/${seq}`);
        const responseDto = response.data;
        if (responseDto.code === 200) {
            if (responseDto.data.pcThumbImage) {
                setSelectedPcThumbImageFile({
                    filePath: `${responseDto.data.pcThumbImage.fileApiViewPath}${responseDto.data.pcThumbImage.fileInfoSeq}`,
                    fileNm: responseDto.data.pcThumbImage.fileOriNm,
                    fileInfoSeq: responseDto.data.pcThumbImage.fileInfoSeq,
                    isExist: true
                });
            }
            if (responseDto.data.moThumbImage) {
                setSelectedMoThumbImageFile({
                    filePath: `${responseDto.data.moThumbImage.fileApiViewPath}${responseDto.data.moThumbImage.fileInfoSeq}`,
                    fileNm: responseDto.data.moThumbImage.fileOriNm,
                    fileInfoSeq: responseDto.data.moThumbImage.fileInfoSeq,
                    isExist: true
                });
            }
            if (responseDto.data.pcMainImage) {
                setSelectedPcMainImageFile({
                    filePath: `${responseDto.data.pcMainImage.fileApiViewPath}${responseDto.data.pcMainImage.fileInfoSeq}`,
                    fileNm: responseDto.data.pcMainImage.fileOriNm,
                    fileInfoSeq: responseDto.data.pcMainImage.fileInfoSeq,
                    isExist: true
                });
            }
            if (responseDto.data.moMainImage) {
                setSelectedMoMainImageFile({
                    filePath: `${responseDto.data.moMainImage.fileApiViewPath}${responseDto.data.moMainImage.fileInfoSeq}`,
                    fileNm: responseDto.data.moMainImage.fileOriNm,
                    fileInfoSeq: responseDto.data.moMainImage.fileInfoSeq,
                    isExist: true
                });
            }
            setServiceBoardDto(responseDto.data);
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
        let useYn = formData.get('useYn');
        if (useYn == '사용') formData.set('useYn', 'Y');
        if (useYn == '미사용') formData.set('useYn', 'N');

        formData.set('delImageList', [1, 2, 3]);
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}proc`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('저장 되었습니다.');
            goList();
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
                if (keyLowerCase.indexOf('pcthumb') > -1) {
                    if (!value.size && !selectedPcThumbImageFile.isExist) {
                        alert(`${element.title}(은)는 필수 요소 입니다.`);
                        isValid = false;
                    }
                }

                if (keyLowerCase.indexOf('mothumb') > -1) {
                    if (!value.size && !selectedMoThumbImageFile.isExist) {
                        alert(`${element.title}(은)는 필수 요소 입니다.`);
                        isValid = false;
                    }
                }

                if (keyLowerCase.indexOf('pcmain') > -1) {
                    if (!value.size && !selectedPcMainImageFile.isExist) {
                        alert(`${element.title}(은)는 필수 요소 입니다.`);
                        isValid = false;
                    }
                }

                if (keyLowerCase.indexOf('momain') > -1) {
                    if (!value.size && !selectedMoMainImageFile.isExist) {
                        alert(`${element.title}(은)는 필수 요소 입니다.`);
                        isValid = false;
                    }
                }
            }
        })

        return isValid;
    }

    const del = async () => {
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}updateDelYn`, {
            serviceBoardSeq: seq,
            delYn: 'Y'
        });

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('삭제 되었습니다.');
            navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
        }
    }

    const delImage = (e) => {
        const id = e.currentTarget.id.toLowerCase();

        if (id.indexOf('pcthumb') > -1) {
            setSelectedPcThumbImageFile({});
            document.getElementById('pcThumbImageFile').value = null;
        } else if (id.indexOf('mothumb') > -1) {
            setSelectedMoThumbImageFile({});
            document.getElementById('moThumbImageFile').value = null;
        } else if (id.indexOf('pcmain') > -1) {
            setSelectedPcMainImageFile({});
            document.getElementById('pcMainImageFile').value = null;
        } else if (id.indexOf('momain') > -1) {
            setSelectedMoMainImageFile({});
            document.getElementById('moMainImageFile').value = null;
        }
    }

    const changedFile = (e) => {
        const id = e.currentTarget.id;
        const deviceType = id.substring(0, id.indexOf('ImageFile'));

        const file = e.currentTarget.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                if (deviceType == 'pcThumb') setSelectedPcThumbImageFile({filePath: e.target.result, fileNm: file.name, fileInfoSeq: null, isExist: true});
                if (deviceType == 'moThumb') setSelectedMoThumbImageFile({filePath: e.target.result, fileNm: file.name, fileInfoSeq: null, isExist: true});
                if (deviceType == 'pcMain') setSelectedPcMainImageFile({filePath: e.target.result, fileNm: file.name, fileInfoSeq: null, isExist: true});
                if (deviceType == 'moMain') setSelectedMoMainImageFile({filePath: e.target.result, fileNm: file.name, fileInfoSeq: null, isExist: true});
            }
            reader.readAsDataURL(file);
        }
    }

    return <div className="container-xxl flex-grow-1 container-p-y">
        <MenuTitle leftMenuInfo={leftMenuInfo}/>
        <div className="row">
            <div className="col-xl-12">
                <div className="card mb-4">
                    <div className="card-body">
                        <form id="procForm" ref={formRef}>
                            <input name="serviceBoardSeq" defaultValue={serviceBoardDto.serviceBoardSeq} type="hidden"/>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">제목</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" defaultValue={serviceBoardDto.title}
                                           id="html5-text-input" name="title" title="제목" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">요약</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" defaultValue={serviceBoardDto.summary}
                                           id="html5-text-input" name="summary" title="요약" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-text-input" className="col-md-2 col-form-label">내용</label>
                                <div className="col-md-10">
                                    <input className="form-control" type="text" defaultValue={serviceBoardDto.content}
                                           id="html5-text-input" name="content" title="내용" required={true}/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="html5-search-input" className="col-md-2 col-form-label">사용 여부</label>
                                <select className="col-md-10 form-select" id="exampleFormControlSelect1"
                                        aria-label="Default select example" name="useYn" title="사용 여부" required={true}>
                                    <option selected={serviceBoardDto.useYn == 'Y'} defaultValue='Y'>사용</option>
                                    <option selected={serviceBoardDto.useYn == 'N'} defaultValue='N'>미사용</option>
                                </select>
                            </div>

                            <div className="mb-3 row">
                                <label htmlFor="formFile" className="col-md-2 form-label">PC 썸네일 이미지</label>
                                <div className="col-md-10">
                                    {
                                        selectedPcThumbImageFile.fileNm ?
                                            <label
                                                className="col-form-label mx-2">{selectedPcThumbImageFile.fileNm} </label> : ''
                                    }
                                    {
                                        selectedPcThumbImageFile.fileNm ?
                                            <button type="button" defaultValue={selectedPcThumbImageFile.fileInfoSeq}
                                                    className="btn btn-danger mx-1 mb-sm-2" id="delPcThumbImageBtn"
                                                    onClick={delImage}>삭제</button> : ''
                                    }
                                    <input
                                        className={`form-control ${selectedPcThumbImageFile.isExist ? 'd-none' : ''}`}
                                        type="file" id="pcThumbImageFile"
                                        name="pcThumbImageFile" title="PC 썸네일 이미지" required={true}
                                        onChange={changedFile}/>
                                    <img src={selectedPcThumbImageFile.filePath}
                                         className={`w-100 my-3 ${!selectedPcThumbImageFile.fileNm ? "d-none" : ""}`}/>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label htmlFor="formFile" className="col-md-2 form-label">MO 썸네일 이미지</label>
                                <div className="col-md-10">
                                    {
                                        selectedMoThumbImageFile.fileNm ?
                                            <label
                                                className="col-form-label mx-2">{selectedMoThumbImageFile.fileNm} </label> : ''
                                    }
                                    {
                                        selectedMoThumbImageFile.fileNm ?
                                            <button type="button" defaultValue={selectedMoThumbImageFile.fileInfoSeq}
                                                    className="btn btn-danger mx-1 mb-sm-2" id="delMoThumbImageBtn"
                                                    onClick={delImage}>삭제</button> : ''
                                    }
                                    <input
                                        className={`form-control ${selectedMoThumbImageFile.isExist ? 'd-none' : ''}`}
                                        type="file" id="moThumbImageFile"
                                        name="moThumbImageFile" title="MO 썸네일 이미지" required={true}
                                        onChange={changedFile}/>
                                    <img src={selectedMoThumbImageFile.filePath}
                                         className={`w-100 my-3 ${!selectedMoThumbImageFile.fileNm ? "d-none" : ""}`}/>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label htmlFor="formFile" className="col-md-2 form-label">PC 메인 이미지</label>
                                <div className="col-md-10">
                                    {
                                        selectedPcMainImageFile.fileNm ?
                                            <label
                                                className="col-form-label mx-2">{selectedPcMainImageFile.fileNm} </label> : ''
                                    }
                                    {
                                        selectedPcMainImageFile.fileNm ?
                                            <button type="button" defaultValue={selectedPcMainImageFile.fileInfoSeq}
                                                    className="btn btn-danger mx-1 mb-sm-2" id="delPcMainImageBtn"
                                                    onClick={delImage}>삭제</button> : ''
                                    }
                                    <input
                                        className={`form-control ${selectedPcMainImageFile.isExist ? 'd-none' : ''}`}
                                        type="file" id="pcMainImageFile"
                                        name="pcMainImageFile" title="PC 메인 이미지" required={true}
                                        onChange={changedFile}/>
                                    <img src={selectedPcMainImageFile.filePath}
                                         className={`w-100 my-3 ${!selectedPcMainImageFile.fileNm ? "d-none" : ""}`}/>
                                </div>
                            </div>

                            <div className={`${seq ? 'mb-3' : ''} row`}>
                                <label htmlFor="formFile" className="col-md-2 form-label">MO 메인 이미지</label>
                                <div className="col-md-10">
                                    {
                                        selectedMoMainImageFile.fileNm ?
                                            <label
                                                className="col-form-label mx-2">{selectedMoMainImageFile.fileNm} </label> : ''
                                    }
                                    {
                                        selectedMoMainImageFile.fileNm ?
                                            <button type="button" defaultValue={selectedMoMainImageFile.fileInfoSeq}
                                                    className="btn btn-danger mx-1 mb-sm-2" id="delMoMainImageBtn"
                                                    onClick={delImage}>삭제</button> : ''
                                    }
                                    <input
                                        className={`form-control ${selectedMoMainImageFile.isExist ? 'd-none' : ''}`}
                                        type="file" id="moMainImageFile"
                                        name="moMainImageFile" title="MO 메인 이미지" required={true}
                                        onChange={changedFile}/>
                                    <img src={selectedMoMainImageFile.filePath}
                                         className={`w-100 my-3 ${!selectedMoMainImageFile.fileNm ? "d-none" : ""}`}/>
                                </div>
                            </div>

                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input"
                                               className="col-md-2 col-form-label">등록일</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{serviceBoardDto.regDate}</label>
                                        </div>
                                    </div> : ''
                            }
                            {
                                seq ?
                                    <div className="mb-3 row">
                                        <label htmlFor="html5-date-input"
                                               className="col-md-2 col-form-label">등록자</label>
                                        <div className="col-md-10">
                                            <label className="col-form-label">{serviceBoardDto.registerNm}</label>
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
                <button type="button" className="btn btn-danger mx-2" onClick={del}>삭제</button>
                <button type="button" className="btn btn-primary" onClick={proc}>저장</button>
            </div>
        </div>
    </div>;
}

export default ServiceBoardMgmtViewPage;