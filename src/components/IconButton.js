import React from "react";
import IconContext from './../contexts/IconButtonContext';
export default function IconButton(props) {

  const { type = "default", icon, className, ...otherProps } = props;
  return (
    <IconContext.Consumer>
      {({state }) => {
        const {IconButtonComponent}=state;
        return (
          IconButtonComponent ? <IconButtonComponent {...props} /> :
          <button
            type="button"
            className={`btn btn-${type} ${className}`}
            {...otherProps}>
            <i className={`fas fa-${icon}`} />
          </button>)
      }
      }
    </IconContext.Consumer>
  );
}
