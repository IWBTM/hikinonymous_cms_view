
const Table = ({leftMenuInfo, columnList, isOnHeader, renderRowCallback}) => {

    const renderColumn = () => {
        return columnList.map((column, index) => {
            return <th key={index}>{column}</th>;
        });
    }

    const renderRow = () => {
        const rows = renderRowCallback();
        if (rows && rows.length > 0) return renderRowCallback();
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
                        <tbody>
                            {renderRow()}
                        </tbody>
                    </table>
                </div>
            </div>
    );
}

export default Table;