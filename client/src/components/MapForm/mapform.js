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

    render() {
        return(
            <div>
                <form className="mapform">
                    <input
                        value={this.state.name}
                        name="name"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="name"
                    />
                    <input
                        value={this.state.creator}
                        name="creator"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="creator"
                    />
                    <input
                        value={this.state.admins}
                        name="admins"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="admins"
                    />
                    <input
                        value={this.state.guests}
                        name="guests"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="guests"
                    />
                    <input
                        value={this.state.dates}
                        name="dates"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="dates"
                    />
                    <input
                        value={this.state.destinations}
                        name="destinations"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="destinations"
                    />
                    <input
                        value={this.state.suggestionCategories}
                        name="suggestionCategories"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="suggestionCategories"
                    />
                    <button>create map</button>
                </form>
            </div>
        )
    }

}
export default MapForm;