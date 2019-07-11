import React, { createContext, useReducer } from 'react';

const initialState = {
    IconButtonComponent: null
};

let reducer = (state, action) => {
   
    switch (action.type) {
        case "setIcon":{
            return { ...state, IconButtonComponent: action.IconButtonComponent };
        }
        default:
            return state;
    }
};

const IconButtonContext = createContext();


const IconButtonContextContainer = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return (
        <IconButtonContext.Provider value={value}>
            {props.children}
        </IconButtonContext.Provider>
    );

}

export default IconButtonContext;

export { initialState, IconButtonContextContainer };