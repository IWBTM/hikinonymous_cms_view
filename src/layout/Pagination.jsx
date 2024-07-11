const Pagination = ({tableResult, getResultCallback}) => {
    const goPaging = (e) => {
        const page = parseInt(e.currentTarget.getAttribute('page'));
        document.getElementById('page').value = page;
        getResultCallback();
    }
    return <nav aria-label="Page navigation" className={`d-flex justify-content-center mx-auto gap-3 container-p-y ${tableResult.totalPages > 0 ? '' : 'd-none'}`}>
                <ul className="pagination">
                    <li className={`page-item first ${tableResult.first ? 'd-none' : ''}`}>
                        <a className="page-link" page={0} onClick={goPaging}>
                            <i className="tf-icon bx bx-chevrons-left"></i>
                        </a>
                    </li>
                    <li className={`page-item prev ${((tableResult.number + 1 - 1) < 1) ? 'd-none' : ''}`}>
                        <a className="page-link" page={tableResult.number - 1} onClick={goPaging}>
                            <i className="tf-icon bx bx-chevron-left"></i>
                        </a>
                    </li>
                    <li className={`page-item ${((tableResult.number + 1 - 2) < 1) ? 'd-none' : ''}`}>
                        <a className="page-link" page={tableResult.number - 2} onClick={goPaging}>{tableResult.number + 1 - 2}</a>
                    </li>
                    <li className={`page-item ${((tableResult.number + 1 - 1) < 1) ? 'd-none' : ''}`}>
                        <a className="page-link" page={tableResult.number - 1} onClick={goPaging}>{tableResult.number + 1 - 1}</a>
                    </li>
                    <li className="page-item active">
                        <a className="page-link">{tableResult.number + 1}</a>
                    </li>
                    <li className={`page-item ${((tableResult.number + 1 + 1) > tableResult.totalPages) ? 'd-none' : ''}`}>
                        <a className="page-link" page={tableResult.number + 1} onClick={goPaging}>{tableResult.number + 1 + 1}</a>
                    </li>
                    <li className={`page-item ${((tableResult.number + 1 + 2) > tableResult.totalPages) ? 'd-none' : ''}`}>
                        <a className="page-link" page={tableResult.number + 2} onClick={goPaging}>{tableResult.number + 1 + 2}</a>
                    </li>
                    <li className={`page-item next ${((tableResult.number + 1 + 1) > tableResult.totalPages) ? 'd-none' : ''}`}>
                        <a className="page-link" page={tableResult.number + 1} onClick={goPaging}>
                            <i className="tf-icon bx bx-chevron-right"></i>
                        </a>
                    </li>
                    <li className={`page-item last ${tableResult.last ? 'd-none' : ''}`}>
                        <a className="page-link" page={tableResult.totalPages - 1} onClick={goPaging}>
                            <i className="tf-icon bx bx-chevrons-right"></i>
                        </a>
                    </li>
                </ul>
            </nav>;


}

export default Pagination;