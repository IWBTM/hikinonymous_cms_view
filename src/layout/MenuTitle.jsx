const MenuTitle = ({leftMenuInfo}) => {
    return <h4 className="py-3 mb-4">
                <span className="text-muted fw-light">{leftMenuInfo.parentNm} /</span> {leftMenuInfo.childNm}
            </h4>
}

export default MenuTitle;