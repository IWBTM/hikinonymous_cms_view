const NotFound = (props) => {
    return (
        <div className="container-xxl container-p-y">
            <div className="misc-wrapper">
                <h2 className="mb-2 mx-2">Page Not Found :(</h2>
                <p className="mb-4 mx-2">잘못된 URL 요청입니다.</p>
                <a href="javascript:history.back();" className="btn btn-primary">돌아가기</a>
                <div className="mt-3">
                    <img src="/src/assets/img/illustrations/page-misc-error-light.png" alt="page-misc-error-light"
                         width="500"
                         className="img-fluid" data-app-dark-img="illustrations/page-misc-error-dark.png"
                         data-app-light-img="../assets/img/illustrations/page-misc-error-light.png"/>
                </div>
            </div>
        </div>
    )
}

export default NotFound;