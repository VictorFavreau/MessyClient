var React = require("react");
var ReactDOM = require("react-dom");
var UserJoin = require("./UserJoin");
var UserConnect = require("./UserConnect");
var Home = require("./Home");

class UserForm extends React.Component {

  constructor(props) {
     super(props);
     this.state = { user:"", token:""};
     this.updateUser = this.updateUser.bind(this);
     this.onClickInscription = this.onClickInscription.bind(this);
     this.onClickConnexion = this.onClickConnexion.bind(this);
     this.backHome = this.backHome.bind(this);
   }

  onClickInscription(){
    this.setState({enableJoin: true});
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



  onClickConnexion(event){
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
    .then(response => {

      if(response.error)
      {
        this.backHome();
      }
      else {
        this.setState({token:response.token});
      }
      //console.log(JSON.stringify(this.state.token));

    });


  }

  backHome()
  {
    this.setState({enableConnect: false, enableJoin: false});
  }

  render() {

    var user = this.state.user;

    if(this.state.token){
      return(<Home token={this.state.token} />);
    }

    if(this.state.enableJoin) {
      return (<UserJoin onClickRetour={this.backHome}/>);
    }

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

        <button onClick={this.onClickConnexion}>Connexion</button>
        <button onClick={this.onClickInscription}>Inscription</button>
      </form>
     );

  }

}

module.exports = UserForm;
