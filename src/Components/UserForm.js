var React = require("react");
var ReactDOM = require("react-dom");
var UserJoin = require("./UserJoin");
var UserConnect = require("./UserConnect");
var Home = require("./Home");

class UserForm extends React.Component {

  constructor(props) {
     super(props);

    if (sessionStorage.getItem('token')!=undefined) {
      this.state = {user: sessionStorage.getItem('user'), token:sessionStorage.getItem('token')};
    }else{
      this.state = {user: {}, token:""};
    }

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

	      sessionStorage.setItem('user', response.user);
        sessionStorage.setItem('token', response.token);
        this.setState({user: response.user, token:response.token});
      }

    });


  }

  backHome()
  {
    this.setState({enableConnect: false, enableJoin: false, user: {}, token:""});
    sessionStorage.clear();
  }

  render() {

    var user = this.state.user;

    if(this.state.token){

      return(<Home onClickRetour={this.backHome}/>);
    }

    if(this.state.enableJoin) {
      return (<UserJoin onClickRetour={this.backHome}/>);
    }

    return (

      <div class='wrap'>
        MESSY CLIENT
        <form onSubmit={this.eventSubmit}>

          <input
            type='text'
            id='username'
            placeholder='Utilisateur'
            name="name"
            value={user.name}
            onInput={ this.updateUser }
            />
          <input
            type='password'
            id='password'
            placeholder='Mot de passe'
            name="password"
            value={user.password}
            onInput={this.updateUser}
            />

        </form>

        <button class='forgot' onClick={this.onClickConnexion}>Connexion</button>
        <button class='login' onClick={this.onClickInscription}>Inscription</button>
      </div>

     );

  }

}

module.exports = UserForm;
