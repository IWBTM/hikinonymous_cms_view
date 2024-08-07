import {useEffect, useRef, useState} from "react";
import api from "../../api/api";
import {useNavigate} from "react-router-dom";
import Table from "../../components/Table";
import Pagination from "../../layout/Pagination";
import MenuTitle from "../../layout/MenuTitle";

const ManagerMgmtListPage = ({leftMenuInfo, filePath, authTypes}) => {
    const [ tableResult, setTableResultList ] = useState({});
    const [ isLoadingOfTable, setIsLoadingOfTable ] = useState({});

    const searchFormRef = useRef();

    const navigate = useNavigate();

    const getTableResultList = async () => {
        setIsLoadingOfTable(true);
        const params = new URLSearchParams(new FormData(searchFormRef.current));
        const response = await api.get(`${filePath}?${params.toString()}`);
        const responseData = response.data;
        if (responseData.code === 200) {
            setIsLoadingOfTable(false);
            setTableResultList(responseData.data);
        }
    };

    useEffect(() => {
        getTableResultList();
    }, []);

    const renderRows = () => {
        if (!tableResult.empty && tableResult.content) {
            return tableResult.content.map((row, index) => {
                let rowNum = tableResult.totalElements - (tableResult.number * tableResult.size) - (tableResult.numberOfElements) + (tableResult.content.length - index);
                return <tr className="cursor-pointer" id={row.managerSeq} onClick={goView} key={index}>
                    <th scope="row">{rowNum}</th>
                    <td>{row.managerNm}</td>
                    <td>{row.managerId}</td>
                    <td>{row.managerStatus}</td>
                    <td>{row.useYn == 'Y' ? '사용' : '미사용'}</td>
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
            </div>
            <Table
                columnList={[
                    '관리자명',
                    '아이디(이메일)',
                    '관리자 상태',
                    '사용 여부',
                    '마지막 로그인 일',
                    '생성일'
                ]}
                leftMenuInfo={leftMenuInfo}
                isOnHeader={true}
                renderRowCallback={renderRows}
            />

            <Pagination tableResult={tableResult} getResultCallback={getTableResultList}/>
            <div className="d-flex justify-content-end container-p-y">
                <button type="button" className="btn btn-primary" onClick={goWrite}>등록</button>
            </div>
        </div>
    );
}

export default ManagerMgmtListPage;