import React, { useEffect, useContext } from 'react';
import Form from "./Form";
import IconButtonContext from './../contexts/IconButtonContext';

export default ({ IconButtonComponent, ...rest }) => {
    const { dispatch } = useContext(IconButtonContext);
    useEffect(() => {
        if (IconButtonComponent) {
            dispatch({ type: "setIcon", IconButtonComponent: IconButtonComponent });
        }
    }, [IconButtonComponent])
    return (<Form {...rest} />)
}
