const MultiNumInput = (props) => {
    return (
        <>
            <div className={props.parentWrapperClass}>
                <div className={props.childWrapperClass}>
                    {
                        props.options.map((option, index) => {
                            return (
                                <div className={props.inputWrapperClass}>
                                    <div className={props.innerInputWrapperClass}>
                                        <div className={props.inputLabelClass}>
                                            {option.label}
                                        </div>
                                        <input
                                            id={`${props.idPrefix}-${option.key}`}
                                            className={props.inputClass}
                                            key={option.key}
                                            type={option.type}
                                            name={option.name}
                                            value={
                                                props.value?.[index]?.key === option.key
                                                    ? props.value[index].value
                                                    : ''
                                            }
                                            onChange={(e) => { props.onChange?.(e, props.keyName, option.key, index) }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
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

export default MultiNumInput;