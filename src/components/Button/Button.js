import React from 'react';
import '../../stylesheets/button.css'
const Button = props => {
    if(props.chooseGen){
        return(
            <div 
            id="main-button-gen" 
            onClick={props.onClick}
            >
            Gen {props.gen}
            </div>
        )
    }
    return(
        <div id="main-button" onClick={props.onClick}>Create {props.treeType} Tree</div>
    )
}

export default Button;