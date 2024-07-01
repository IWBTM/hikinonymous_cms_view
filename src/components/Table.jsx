
const Table = ({leftMenuInfo, columnList, isOnHeader, renderRowCallback}) => {

    const renderColumn = () => {
        return columnList.map((column, index) => {
            return <th key={index}>{column}</th>;
        });
    }

    return (
            <div className="card">
                {
                    isOnHeader ?
                    <h5 className="card-header">{leftMenuInfo.childNm.substring(0, leftMenuInfo.childNm.lastIndexOf('관리')) + " "}</h5> : ''
                }
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
    );
}

export default Table;