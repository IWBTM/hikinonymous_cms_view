const Carousel = ({fileDtoList}) => {

    const renderImageButtons = () => {
        return fileDtoList?.map((boardFileDto, index) => {
            return <li key={`carouselExample-${index}`} data-bs-target="#carouselExample" data-bs-slide-to={index} className={`${index == 0 ? 'active' : ''}`}></li>;
        });
    }

    const renderImageItems = () => {
        return fileDtoList?.map((boardFileDto, index) => {
            const fileDto = boardFileDto.fileDto;
            return <div className={`carousel-item ${index == 0 ? 'active' : ''}`} key={`carousel-item-${index}`}>
                        <img className="d-block w-100" src={`${fileDto.fileApiViewPath}${fileDto.fileInfoSeq}`}/>
                        <div className="carousel-caption d-none d-md-block">
                            <h3>{boardFileDto.fileOriNm}</h3>
                        </div>
                    </div>;
        });
    }

    return <div className="col-md">
            <div id="carousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {renderImageButtons()}
                </div>
                <div className="carousel-inner">
                    {renderImageItems()}
                </div>
                <a className="carousel-control-prev" href="#carousel" role="button"
                   data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carousel" role="button"
                   data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </a>
            </div>
        </div>;
}

export default Carousel;