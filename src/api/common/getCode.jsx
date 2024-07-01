import api from "../api";

const getCodeListByCodeMaster = async (codeMaster) => {
    const response = await api.get(`/cms/common/codeListByCodeMaster/${codeMaster}`);
    const responseDto = response.data;
    if (responseDto.code === 200) {
        return responseDto.data;
    } else {
        console.log(responseDto.message)
    }
}

export default getCodeListByCodeMaster;