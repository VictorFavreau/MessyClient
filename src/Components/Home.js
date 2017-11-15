var React = require("react");
var ReactDOM = require("react-dom");

var UserForm = require("./UserForm");


class Home extends React.Component {
    constructor(props) {
        super(props);

        if (sessionStorage.getItem('token')!=undefined) {
            this.state = {user: sessionStorage.getItem('user'), token:sessionStorage.getItem('token')};
        }else{
            this.state = {user: {}, token:""};
        }

        this.updateMessage = this.updateMessage.bind(this);
        this.nouveauMessage = this.nouveauMessage.bind(this);
        this.getlistMessages = this.getlistMessages.bind(this);
        this.renderMessage = this.renderMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
    }

    componentDidMount()
    {
        const ws = new WebSocket("wss://messy.now.sh");

        ws.onmessage = function (message) {
            var data = JSON.parse(message.data);
            switch (data.event) {
                case "message.created":
                    var msg = this.state.listMessages;
                    msg.push(data.message);
                    this.setState({ listMessages: msg });
                    break;

                case "message.deleted":
                function match(element) {
                    return element.id !== data.id;
                }
                    var msg = this.state.listMessages.filter(match);
                    this.setState({ listMessages: msg });
                    break;
            }
        }.bind(this)

        this.getlistMessages();
    }

    renderMessage(message){

        if(message.user.id == this.state.user.id){
            return(

                <li>
                    <a class='thumbnail' href='#'>
                        <img src={message.user.image}/>
                    </a>
                    <div class='content'>
                        <h3>{message.user.name}</h3>
                        <span class='preview'>{message.message}</span>
                        <span class='meta'>
                {message.date}

                            &middot;
                            <a href="#" onClick={this.deleteMessage.bind(this,message.id)}>SUPPRIMER</a>
            </span>
                    </div>
                </li>
            );
        }
        else{
            return(

                <li>
                    <a class='thumbnail' href='#'>
                        <img src={message.user.image} />
                    </a>
                    <div class='content'>
                        <h3>{message.user.name}</h3>
                        <span class='preview'>{message.message}</span>
                        <span class='meta'>
                {message.date}

                            &middot;
                            <a href="#" onClick={this.deleteMessage.bind(this,message.id)}>SUPPRIMER</a>
            </span>
                    </div>
                </li>


            );
        }
    }

    getlistMessages()
    {
        var token = this.state.token;

        fetch('https://messy.now.sh/u/timeline', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer:" + token
            }
        })
            .then(response => response.json())
            .then(response => {

                this.setState({listMessages:response});
            });
    }

    updateMessage(event) {

        this.setState({
            message: event.target.value
        });
    }

    nouveauMessage()
    {
        var token = this.state.token;

        fetch('https://messy.now.sh/u/timeline', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer:" + token,
            },
            body: JSON.stringify({message: this.state.message})
        })
            .then(response => response.json())
            .then(response => {

            });
    }

    deleteMessage(idMessage)
    {
        var token = this.state.token;

        var url = "https://messy.now.sh/u/timeline/" + idMessage;

        fetch(url, {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer:" + token,
            },

        });
    }

    render() {

        if(this.state.listMessages)
        {
            this.state.listMessages.sort(
                function(a, b){
                    if(a.date>=b.date){
                        return -1;
                    }
                    else {
                        return 1;
                    }
                }
            );


            var listMessagesPrepared = this.state.listMessages.map(this.renderMessage);

            return(

                <div class='chat'>

                    <header>
                        <h2 class='title'>
                            Nouveau :
                        </h2>
                        <ul class='tools'>
                            <li>
                                <a class='fa fa-gear' href='#'></a>
                            </li>
                            <li>
                                <a class='fa fa-search' href='#'></a>
                            </li>
                        </ul>
                    </header>
                    <div class='body'>
                        <br/>
                        <label>Message : </label>
                        <input
                            class="input_message"
                            name="message"
                            value={this.state.message}
                            onInput={ this.updateMessage }
                        />
                        <button class='forgot' onClick={this.nouveauMessage}>Envoyer</button>
                        <button class='forgot' onClick={this.getlistMessages}>Actualiser</button><br/>

                    </div>
                    <br/>
                    <header>
                        <h2 class='title'>
                            Liste Messages :
                        </h2>
                        <ul class='tools'>
                            <li>
                                <a class='fa fa-gear' href='#'></a>
                            </li>
                            <li>
                                <a class='fa fa-search' href='#'></a>
                            </li>
                        </ul>
                    </header>
                    <div class='body'>

                        <ul>
                            {listMessagesPrepared}
                        </ul>
                    </div>
                    <footer>
                        <a href='#' onClick={this.props.onClickRetour}>Deconnexion</a>
                    </footer>
                </div>

            )
        }

        return(
            <div class="loader_container">
                <div class="loader"></div>
            </div>
        );
    }
}

module.exports = Home;
