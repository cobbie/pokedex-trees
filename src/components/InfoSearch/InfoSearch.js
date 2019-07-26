import React from 'react';
import '../../stylesheets/infosearch.css'
import Button from '../Button/Button';

const InfoSearch = props => {

    if(props.treeOp==="traversal")
    return(
        <div id='main-container'>
            <div id='main-flexbox'>
                <div id='queue-path'>{props.arrayType}: {props.array}</div>
                <div id='visited-search'>{props.resultsType}: {props.results}</div>
            </div>
        </div>
    )
    else if(props.treeOp==="generation"){
        return(
            <div id="main-container-genButtons">
                <div id="column-container">
                <div id="choose-gen">CHOOSE POKEMON GENERATION</div>
                <div id="">GENERATION: {props.gen}</div>
                <div id="main-flexbox-genButtons">
                    <Button 
                        chooseGen={true}
                        gen={"1"}
                        onClick={props.onClick1}
                    />
                    <Button 
                        chooseGen={true}
                        gen={"1,2,3"}
                        onClick={props.onClick123}
                    />
                </div>
                </div>
            </div>
        )
    } else if(props.treeOp==="informed"){
        return(
            <div id="main-container-genButtons">
                <div id="column-container">
                <div id="choose-gen">SEARCH START/END NODES</div>
                <div id='visited-search'>{props.resultsType1}: {props.results1}</div>
                <div id='visited-search'>{props.resultsType2}: {props.results2}</div>
                </div>
            </div>
        )
    }
}

export default InfoSearch;