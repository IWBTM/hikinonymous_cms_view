import MenuTitle from "../layout/MenuTitle";
import Pagination from "../layout/Pagination";
import {useNavigate} from "react-router-dom";

const Table = ({leftMenuInfo, columnList, tableResult, filePath, renderRowCallback}) => {

    const navigate = useNavigate();

    const renderColumn = () => {
        return columnList.map(column => {
            return <th>{column}</th>;
        });
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
            <div className="card">
                <h5 className="card-header">{leftMenuInfo.childNm.substring(0, leftMenuInfo.childNm.lastIndexOf('관리')) + " "}</h5>
                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead>
                        <tr className="text-nowrap">
                            <th>#</th>
                            {renderColumn()}
                        </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                        {renderRowCallback()}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination tableResult={tableResult}/>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-primary" onClick={goWrite}>등록</button>
            </div>
        </div>
    );
}

export default Table;