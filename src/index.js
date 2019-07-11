import React from 'react';
import FormWrapper from "./components/FormWrapper";
import  { IconButtonContextContainer } from './contexts/IconButtonContext';

export default (props) => {
    return (<IconButtonContextContainer>
        <FormWrapper {...props} />
    </IconButtonContextContainer>)
}
