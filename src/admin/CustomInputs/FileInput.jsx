const FileInput = (props) => {
    return (
        <>
            <div className={props.wrapperClass}>
                <input
                    className=  {props.inputClass}
                    id=         {props.id}
                    key=        {props.key}
                    type=       {props.type || 'file'}
                    name=       {props.name || 'file-input'}
                    value=      {props.value}
                    placeholder={props.placeholder}
                    onChange=   {(e) => { props.onChange?.(e) }}
                    onClick=    {(e) => { props.onClick?.(e) }}
                    onMouseOver={(e) => { props.onMouseOver?.(e) }}
                    onMouseOut= {(e) => { props.onMouseOut?.(e) }}
                    onFocus=    {(e) => { props.onFocus?.(e) }}
                />
                <img
                    src=    {props.imageSrc}
                    width=  {props.imageWidth}
                    height= {props.imageHeight}
                />
                <button
                    className=  {props.buttonClass}
                    type=       "button"
                    onClick=    {(e) => { props.onButtonClick?.(e) }}
                >
                    {props.openUploader}
                </button>
                {
                    props.description &&
                    <p className={props.descClass}>
                        {props.description}
                    </p>
                }
            </div>
        </>
    );
}

export default FileInput;