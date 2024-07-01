import MenuTitle from "./layout/MenuTitle";
import {useEffect, useState} from "react";
import api from "../api/api";
import Pagination from "./layout/Pagination";

const TablePage = ({leftMenuInfo, columnList, filePath}) => {
    const [ tableResult, setTableResultList ] = useState({});

    useEffect(() => {
        const getTableResultList = async () => {
            const response = await api.get(filePath);
            const responseData = response.data;
            if (responseData.code == 200) {
                setTableResultList(responseData.data);
            }
        };

        getTableResultList();
    }, []);

    const renderColumn = () => {
        return columnList.map(column => {
            return <th>{column}</th>;
        });
    }

    const renderRows = () => {
        if (!tableResult.empty && tableResult.content) {
            return tableResult.content.map((row, index) => {
                let rowNum = (tableResult.totalElements - tableResult.totalPages) * (tableResult.number + index + 1);
                return <tr>
                    <th scope="row">{rowNum}</th>
                    <td>{row.managerNm}</td>
                    <td>{row.managerId}</td>
                    <td>{row.managerStatus}</td>
                    <td>{row.lastLoginDate}</td>
                    <td>{row.regDate}</td>
                </tr>;
            }).reverse();
        }
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <MenuTitle leftMenuInfo={leftMenuInfo}/>

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
                        {renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination tableResult={tableResult}/>
        </div>
    );
}

export default TablePage;