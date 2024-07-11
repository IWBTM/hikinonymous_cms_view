import MenuTitle from "../../layout/MenuTitle";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import getCodeListByCodeMaster from "../../api/common/getCode";
import api from "../../api/api";
import Table from "../../components/Table";
import Pagination from "../../layout/Pagination";
import Carousel from "../../components/Carsousel";

const BoardMgmtViewPage = ({leftMenuInfo}) => {

    const location = useLocation();
    const { seq, filePath } = location.state;

    const [ boardDto, setBoardDto ] = useState({});
    const [ tableResult, setTableResultList ] = useState({});
    const [ isLoadingOfTable, setIsLoadingOfTable ] = useState({});

    const searchFormRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        if (seq) {
            getBoardView();
            getReplyList();
        }
    }, []);

    const getBoardView = async () => {
        const response = await api.get(`${filePath}/${seq}`);
        const responseDto = response.data;
        if (responseDto.code === 200) {
            setBoardDto(responseDto.data);
        }
    }

    const getReplyList = async () => {
        setIsLoadingOfTable(true);
        const params = new URLSearchParams(new FormData(searchFormRef.current));
        const response = await api.get(`${filePath.substring(0, filePath.lastIndexOf('board/view'))}reply/list/${seq}?${params.toString()}`);
        const responseDto = response.data;
        if (responseDto.code === 200) {
            setIsLoadingOfTable(false);
            setTableResultList(responseDto.data);
        }
    }

    const goList = () => {
        navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
    }

    const del = async () => {
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('view'))}updateDelYn`, {
            boardSeq: seq,
            delYn: 'Y'
        });

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('삭제 되었습니다.');
            navigate(`${filePath.substring(0, filePath.lastIndexOf('view'))}list`);
        }
    }

    const delReply = async (e) => {
        const seq = e.currentTarget.value;
        const response = await api.post(`${filePath.substring(0, filePath.lastIndexOf('board/view'))}reply/updateDelYn`, {
            replySeq: seq,
            delYn: 'Y'
        });

        const responseDto = response.data;
        if (responseDto.code === 200) {
            alert('삭제 되었습니다.');
            getReplyList();
        }
    }

    const renderRows = () => {
        if (!tableResult.empty && tableResult.content) {
            return tableResult.content.map((row, index) => {
                let rowNum = tableResult.totalElements - (tableResult.number * tableResult.size) - (tableResult.numberOfElements) + (tableResult.content.length - index);
                return <tr className="cursor-pointer" key={index}>
                    <th scope="row">{rowNum}</th>
                    <td>{row.content}</td>
                    <td>{row.delYn == 'Y' ? '삭제' : '미삭제'}</td>
                    <td>{row.registerNm}</td>
                    <td>{row.registerNickName}</td>
                    <td>{row.regDate}</td>
                    <td>
                        <button type="button" value={row.replySeq} className="btn btn-danger mx-2" onClick={delReply}>삭제</button>
                    </td>
                </tr>;
            });
        }
    }

    return <div className="container-xxl flex-grow-1 container-p-y">
        <MenuTitle leftMenuInfo={leftMenuInfo}/>
        <div className="row">
            <div className="col-xl-12">
                <div className="card mb-4">
                    <div className="card-body">
                        <input name="boardSeq" defaultValue={boardDto.boardSeq} type="hidden"/>
                        <div className="mb-3 row">
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">제목</label>
                            <div className="col-md-10">
                                <input className="form-control" type="text" defaultValue={boardDto.title}
                                       id="html5-text-input" name="title" title="제목" required={true}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">내용</label>
                            <div className="col-md-10">
                                <input className="form-control" type="text" defaultValue={boardDto.content}
                                       id="html5-text-input" name="content" title="내용" required={true}/>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">파일</label>
                            <div className={`col-md-10 ${boardDto.boardFileDtoList?.length > 0 ? 'd-none' : ''}`}>
                                <label className="col-form-label">첨부된 파일이 없습니다.</label>
                            </div>
                            <div className={`col-md-10 ${boardDto.boardFileDtoList?.length > 0 ? '' : 'd-none'}`}>
                                <Carousel fileDtoList={boardDto.boardFileDtoList}/>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="html5-date-input"
                                   className="col-md-2 col-form-label">등록일</label>
                            <div className="col-md-10">
                                <label className="col-form-label">{boardDto.regDate}</label>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-date-input"
                                   className="col-md-2 col-form-label">등록자</label>
                            <div className="col-md-10">
                                <label className="col-form-label">{boardDto.registerNm}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-sm-12 col-md-6">
            <div className="dataTables_info" id="DataTables_Table_1_info" role="status" aria-live="polite">
                총 {tableResult.totalElements}개의 데이터 중 {tableResult.numberOfElements}개
            </div>
            <form ref={searchFormRef}>
                <input name="page" id="page" type="hidden"/>
            </form>
        </div>
        <Table
            columnList={[
                '내용',
                '삭제 여부',
                '작성자',
                '별명',
                '작성일',
                ''
            ]}
            isLoading={isLoadingOfTable}
            isOnHeader={false}
            leftMenuInfo={{childNm: '댓글 관리'}}
            renderRowCallback={renderRows}
        />

        <Pagination tableResult={tableResult} getResultCallback={getReplyList}/>

        <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={goList}>리스트</button>
            <div className="d-flex justify-content-around">
                <button type="button" className="btn btn-danger mx-2" onClick={del}>삭제</button>
            </div>
        </div>
    </div>;
}

export default BoardMgmtViewPage;