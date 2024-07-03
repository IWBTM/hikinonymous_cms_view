const Pagination = ({tableResult}) => {
    return (tableResult.totalPages > 0) ?
            <nav aria-label="Page navigation" className="d-flex justify-content-center mx-auto gap-3 container-p-y">
                <ul className="pagination">
                    {
                        !tableResult.first ?
                            <li className="page-item first">
                                <a className="page-link">
                                    <i className="tf-icon bx bx-chevrons-left"></i>
                                </a>
                            </li> : ''
                    }
                    {
                        !((tableResult.number + 1 - 1) < 1) ?
                            <li className="page-item prev">
                                <a className="page-link">
                                    <i className="tf-icon bx bx-chevron-left"></i>
                                </a>
                            </li> : ''
                    }
                    {
                        !((tableResult.number + 1 - 2) < 1) ?
                            <li className="page-item">
                                <a className="page-link">{tableResult.number + 1 - 2}</a>
                            </li> : ''
                    }
                    {
                        !((tableResult.number + 1 - 1) < 1) ?
                            <li className="page-item">
                                <a className="page-link">{tableResult.number + 1 - 1}</a>
                            </li> : ''
                    }
                    <li className="page-item active">
                        <a className="page-link">{tableResult.number + 1}</a>
                    </li>
                    {
                        !((tableResult.number + 1 + 1) > tableResult.totalPages) ?
                            <li className="page-item">
                                <a className="page-link">{tableResult.number + 1 + 1}</a>
                            </li> : ''
                    }
                    {
                        !((tableResult.number + 1 + 2) > tableResult.totalPages) ?
                            <li className="page-item">
                                <a className="page-link">{tableResult.number + 1 + 2}</a>
                            </li> : ''
                    }
                    {
                        !((tableResult.number + 1 + 1) > tableResult.totalPages) ?
                            <li className="page-item next">
                                <a className="page-link">
                                    <i className="tf-icon bx bx-chevron-right"></i>
                                </a>
                            </li> : ''
                    }
                    {
                        !tableResult.last ?
                            <li className="page-item last">
                                <a className="page-link">
                                    <i className="tf-icon bx bx-chevrons-right"></i>
                                </a>
                            </li> : ''
                    }
                </ul>
            </nav> : "";


}

export default Pagination;