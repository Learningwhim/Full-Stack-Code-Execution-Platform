
function Button({onClick, type, className}) {
    return (
        <button
        onClick={onClick} 
        type={type||"button"}
        className={className}
        ></button>
    );
}

export default Button;