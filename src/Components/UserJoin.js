var React = require("react");
var ReactDOM = require("react-dom");
var Home = require("./Home");

class UserJoin extends React.Component {
    constructor(props) {
        super(props);

        if (sessionStorage.getItem('token')!=undefined) {
            this.state = {user: sessionStorage.getItem('user'), token:sessionStorage.getItem('token')};
        }else{
            this.state = {user: {}, token:""};
        }

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
                    sessionStorage.setItem('user', response.user);
                    sessionStorage.setItem('token', response.token);
                    this.setState({user: response.user, token:response.token});
                }
            });

    }

    render() {

        if(this.state.token){
            return(<Home onClickRetour={this.props.onClickRetour}/>);
        }

        var user = this.state.user;
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
                    <input
                        type='text'
                        id='pict'
                        placeholder='URL Image'
                        name="image"
                        value={user.image}
                        onInput={this.updateUser}
                    />

                </form>

                <button class='forgot' onClick={this.eventSubmit}>Inscription</button>
                <button class='login' onClick={this.props.onClickRetour}>Retour</button>

            </div>


        );
    }
}

module.exports = UserJoin;
