var React = require("react");
var ReactDOM = require("react-dom");
var Home = require("./Home");

class UserJoin extends React.Component {
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

     fetch('https://messy.now.sh/join', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(user)
     })
     .then(response => response.json())
     .then(response => {
       if(response.error)
       {
         this.props.onClickRetour;
       }
       else {
         this.setState({token:response.token});
       }
     });

   }

   render() {

     if(this.state.token){
       return(<Home token={this.state.token} />);
     }

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
         <label>Image URL : </label>
         <input
           name="image"
           value={user.image}
           onInput={this.updateUser}
         /><br/>
         <input type="submit" value="Inscription" />
        <button onClick={this.props.onClickRetour}>Retour</button>
       </form>
     );
   }
}

module.exports = UserJoin;
