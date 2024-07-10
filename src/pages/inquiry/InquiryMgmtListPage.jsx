import {useEffect, useState} from "react";
import api from "../../api/api";
import {useNavigate} from "react-router-dom";
import Table from "../../components/Table";
import Pagination from "../../layout/Pagination";
import MenuTitle from "../../layout/MenuTitle";

const InquiryMgmtListPage = ({leftMenuInfo, filePath}) => {
    const [tableResult, setTableResultList] = useState({});

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
                return <tr className="cursor-pointer" id={row.inquirySeq} onClick={goView} key={index}>
                    <th scope="row">{rowNum}</th>
                    <td>{row.title}</td>
                    <td>{row.inquiryType.codeNm}</td>
                    <td>{row.readYn == 'Y' ? '확인' : '미확인'}</td>
                    <td>{row.answerYn == 'Y' ? '했음' : '안 했음'}</td>
                    <td>{row.registerNm}</td>
                    <td>{row.regDate}</td>
                </tr>;
            }).reverse();
        }
    }

    const goView = (e) => {
        let viewPath = `${filePath.substring(0, filePath.lastIndexOf('list'))}view`;
        navigate(viewPath, {state: {seq: e.currentTarget.id, filePath: viewPath}})
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
                    '제목',
                    '문의 타입',
                    '확인 여부',
                    '답장 여부',
                    '작성자',
                    '작성일'
                ]}
                leftMenuInfo={leftMenuInfo}
                isOnHeader={true}
                renderRowCallback={renderRows}
            />

            <Pagination tableResult={tableResult}/>
        </div>
    );
}

export default InquiryMgmtListPage;