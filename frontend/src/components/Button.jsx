
function Button({onClick, type, className, children}) {
    return (
        <button
        onClick={onClick} 
        type={type||"button"}
        className={className}
        >{children}</button>
    );
}

export default Button;