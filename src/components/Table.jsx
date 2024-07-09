import Spinner from "./Spinner";

const Table = ({leftMenuInfo, columnList, isOnHeader, renderRowCallback, isLoading}) => {

    const renderColumn = () => {
        return columnList.map((column, index) => {
            return <th key={index}>{column}</th>;
        });
    }

    const renderRow = () => {
        const rows = renderRowCallback();
        if (rows && rows.length > 0) return renderRowCallback();
    }

    const renderTable = () => {
        if (isLoading) {
            return <Spinner/>;
        } else {
            return <div className="card">
                        <h5 className={`card-header ${!isOnHeader ?? 'd-none'}`}>{leftMenuInfo.childNm.substring(0, leftMenuInfo.childNm.lastIndexOf('관리')) + " "}</h5>
                        <div className="table-responsive text-nowrap">
                            <table className="table">
                                <thead>
                                <tr className="text-nowrap">
                                    <th>#</th>
                                    {renderColumn()}
                                </tr>
                                </thead>
                                <tbody>
                                {renderRow()}
                                </tbody>
                            </table>
                        </div>
                    </div>;
        }
    }

    return renderTable();
}

export default Table;