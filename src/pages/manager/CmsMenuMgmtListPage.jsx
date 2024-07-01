import {useEffect, useState} from "react";
import api from "../../api/api";
import {useNavigate} from "react-router-dom";
import Table from "../../components/Table";

const ManagerMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [ tableResult, setTableResultList ] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const getTableResultList = async () => {
            const response = await api.get(filePath);
            const responseData = response.data;
            if (responseData.code === 200) {
                setTableResultList(responseData.data);
            }
        };

        getTableResultList();
    }, []);

    const renderRows = () => {
        if (!tableResult.empty && tableResult.content) {
            return tableResult.content.map((row, index) => {
                let rowNum = (tableResult.totalElements - tableResult.totalPages) * (tableResult.number + index + 1);
                return <tr className="cursor-pointer" id={row.managerSeq} onClick={goView}>
                           <th scope="row">{rowNum}</th>
                       </tr>;
            }).reverse();
        }
    }

    const goView = (e) => {
        let viewPath = `${filePath.substring(0, filePath.lastIndexOf('list'))}view`;
        navigate(viewPath , { state: { seq: e.currentTarget.id, filePath: viewPath } })
    }

    return <Table
        columnList={[
            '관리자 이름',
            '아이디(이메일)',
            '관리자 상태',
            '마지막 로그인 일',
            '생성일'
        ]}
        leftMenuInfo={leftMenuInfo}
        tableResult={tableResult}
        filePath={filePath}
        renderRowCallback={renderRows}
    />;
}

export default ManagerMgmtListPage;