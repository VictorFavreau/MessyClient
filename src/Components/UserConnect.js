var React = require("react");
var ReactDOM = require("react-dom");
var UserForm = require("./UserForm");

class UserConnect extends React.Component {

  constructor(props) {
     super(props);

     this.state = { user: "" };
     this.updateUser = this.updateUser.bind(this);
     this.eventSubmit = this.eventSubmit.bind(this);
   }

   getInitialState() {
     return { user: { name: "", password: "", image: "" } };
   }

   updateUser(event) {
     var updatedU = Object.assign({},
       this.state.user,
       { [event.target.name]: event.target.value }
     );
     this.setState({
       user: updatedU
     });
   }

   eventSubmit(event) {

     var user = this.state.user;

     //NE RAFRAICHIS PLUS LA PAGE
     event.preventDefault();

     fetch('https://messy.now.sh/authenticate', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(user)
     })
     .then(response => response.json())
     .then(function(response) {
       //alert(JSON.stringify(response));
       console.log(response);
     });

   }


   render() {

     var user = this.state.user;


     return (
       <form onSubmit={this.eventSubmit}>
       this.state = { JSON.stringify(user) } <br/>
         <label>Name : </label>
         <input
            name="name"
            value={user.name}
            onInput={ this.updateUser }
            /><br/>
         <label>Password : </label>
         <input
           name="password"
           value={user.password}
           onInput={this.updateUser}
         /><br/>

         <input type="submit" value="Submit" />
         <button onClick={this.props.onClickRetour}>Retour</button>

       </form>
     );
   }
}

module.exports = UserConnect;
