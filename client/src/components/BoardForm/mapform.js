//import react and component functionality
import React, {Component} from "react";
//import the css styling for this form
import "./mapform.css";

class MapForm extends Component {
    //set component's initial state 
    state = {
        name: "",
        creator: "",
        admins: "",
        guests: "",
        dates: "",
        destinations: "",
        suggestionCategories: ""

    }

    //get value and name of input which triggered change 
    handleInputChange = event =>{
        const value = event.target.value;
        const name = event.target.name;

        //update input state
        this.setState({
            [name]:value
        })
    }

    handleFormSubmit = event =>{
        event.preventDefault();

        //set state back to an empty string to clear fields
        this.setState({
            name: "",
            creator: "",
            admins: "",
            guests: "",
            dates: "",
            destinations: "",
            suggestionCategories: ""
        })

    }

}