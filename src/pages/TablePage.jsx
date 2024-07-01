import MenuTitle from "./layout/MenuTitle";
import {useEffect, useState} from "react";
import api from "../api/api";

const TablePage = ({leftMenuInfo, columnList, filePath}) => {
    const [ tabletResultList, setTableResultList ] = useState([]);

    useEffect(() => {
        const getTableResultList = async () => {
            const response = await api.get(filePath);
            console.log('response.data:: ', response.data)
            const responseData = response.data;
            if (responseData.code == 200) {
                let resultList = responseData.data.content;
                let resultTempList = [];
                for (let i = 0; i < resultList.length; i++) {
                    let result = {
                        managerNm: resultList[i].managerNm,
                        managerId: resultList[i].managerId,
                        managerStatus: resultList[i].managerStatus,
                        lastLoginDate: resultList[i].lastLoginDate,
                        regDate: resultList[i].regDate,
                    };

                    resultTempList.push(result);
                }
                setTableResultList(resultTempList);
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
        return tabletResultList.map(row => {
            return <tr>
                        <th scope="row">1</th>
                        <td>{row.managerNm}</td>
                        <td>{row.managerId}</td>
                        <td>{row.managerStatus}</td>
                        <td>{row.lastLoginDate}</td>
                        <td>{row.regDate}</td>
                    </tr>;
        });
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
        </div>
    );
}

export default TablePage;