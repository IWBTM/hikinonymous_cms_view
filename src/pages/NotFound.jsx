const NotFound = (props) => {
    const goBack = () => {
        window.history.back();
    }
    return (
        <div className="container-xxl container-p-y">
            <div className="misc-wrapper">
                <h2 className="mb-2 mx-2">Page Not Found :(</h2>
                <p className="mb-4 mx-2">잘못된 URL 요청입니다.</p>
                <a className="btn btn-primary cursor-pointer" onClick={goBack}>돌아가기</a>
                <div className="mt-3">
                    <img src={`${process.env.PUBLIC_URL}/images/illustrations/page-misc-error-light.png`} alt="page-misc-error-light"
                         width="500"
                         className="img-fluid" data-app-dark-img="illustrations/page-misc-error-dark.png"
                         data-app-light-img="../assets/img/illustrations/page-misc-error-light.png"/>
                </div>
            </div>
        </div>
    )
}

export default NotFound;