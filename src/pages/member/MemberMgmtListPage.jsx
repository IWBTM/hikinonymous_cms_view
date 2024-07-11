import {useEffect, useRef, useState} from "react";
import api from "../../api/api";
import {useNavigate} from "react-router-dom";
import Table from "../../components/Table";
import Pagination from "../../layout/Pagination";
import MenuTitle from "../../layout/MenuTitle";

const MemberMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [ tableResult, setTableResultList ] = useState({});
    const [ isLoadingOfTable, setIsLoadingOfTable ] = useState({});

    const searchFormRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {

        getTableResultList();
    }, []);

    const getTableResultList = async () => {
        setIsLoadingOfTable(true);
        const params = new URLSearchParams(new FormData(searchFormRef.current));
        const response = await api.get(`${filePath}?${params.toString()}`);
        const responseData = response.data;
        setIsLoadingOfTable(false);
        if (responseData.code === 200) {
            setTableResultList(responseData.data);
        }
    };

    const renderRows = () => {
        if (!tableResult.empty && tableResult.content) {
            return tableResult.content.map((row, index) => {
                let rowNum = tableResult.totalElements - (tableResult.number * tableResult.size) - (tableResult.numberOfElements) + (tableResult.content.length - index);
                return <tr className="cursor-pointer" id={row.memberSeq} onClick={goView} key={index}>
                    <th scope="row">{rowNum}</th>
                    <td>{row.memberName}</td>
                    <td>{row.memberNickName}</td>
                    <td>{row.memberEmail}</td>
                    <td>{row.memberStatus.codeNm}</td>
                    <td>{row.reportCnt}</td>
                    <td>{row.totalBoardCnt}</td>
                    <td>{row.totalReplyCnt}</td>
                    <td>{row.lastLoginDate}</td>
                    <td>{row.regDate}</td>
                </tr>;
            });
        }
    }

    const goView = (e) => {
        let viewPath = `${filePath.substring(0, filePath.lastIndexOf('list'))}view`;
        navigate(viewPath, {state: {seq: e.currentTarget.id, filePath: viewPath}})
    }

    const goWrite = () => {
        let viewPath = `${filePath.substring(0, filePath.lastIndexOf('list'))}view`;
        navigate(viewPath , { state: { filePath: viewPath } })
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <MenuTitle leftMenuInfo={leftMenuInfo}/>
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
                    '회원명',
                    '별명',
                    '아이디 (이메일)',
                    '회원 상태',
                    '신고 횟수',
                    '작성한 게시물 수',
                    '작성한 댓글 수',
                    '마지막 로그인 일',
                    '가입일'
                ]}
                leftMenuInfo={leftMenuInfo}
                isOnHeader={true}
                isLoading={isLoadingOfTable}
                renderRowCallback={renderRows}
            />

            <Pagination tableResult={tableResult} getResultCallback={getTableResultList}/>
        </div>
    );
}

export default MemberMgmtListPage;