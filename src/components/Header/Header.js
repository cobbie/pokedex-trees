import React from 'react';
import '../../stylesheets/header.css'
import piplup from '../../images/pika.png'

const Header = props => {
    return(
        <div id="main">
            <div id="flex-container-main">
                <div id="logo-header-container"><div id="logo">
                <img 
                src={piplup} 
                alt="Logo"
                id="logo"
                />
                </div>
                <div id="pokedex">Pokedex</div>
                </div>
                <div id="tree-item-flex-container">
                    <div className="tree-navbar" onClick={props.onClick1}>Tree Generation</div>
                    <div className="tree-navbar" onClick={props.onClick2}>Tree Traversal</div>
                    <div className="tree-navbar" onClick={props.onClick3}>Force Directed Graph</div>
                </div>
            </div>
        </div>
    )
}

export default Header;