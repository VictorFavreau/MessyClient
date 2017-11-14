var React = require("react");
var ReactDOM = require("react-dom");


class Home extends React.Component {
  constructor(props) {
     super(props);
     this.state = {token: this.props.token }
     this.updateMessage = this.updateMessage.bind(this);
     this.nouveauMessage = this.nouveauMessage.bind(this);
     this.getlistMessages = this.getlistMessages.bind(this);

   }

   componentDidMount()
   {
     this.getlistMessages();
   }

   renderMessage(message){

     return(
       <div>
        <h3>{message.user.name}</h3>
        <img src={message.user.image} width="200px"/>
        <p>{message.message}</p>
       </div>
     );
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

       this.setState({
         listMessages : this.state.listMessages.concat(response)
       });


     });


   }



   render() {



     //var message = this.state.message.map(renderMessage);
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
         <div>
          <div>
            <h1>Message:</h1>
            <label>Message : </label>
            <input
               name="message"
               value={this.state.message}
               onInput={ this.updateMessage }
             /><br/>
             <button onClick={this.nouveauMessage}>Envoyer</button>
             <button onClick={this.getlistMessages}>Actualiser</button><br/>
          </div>
          <div>
            <h1>Timeline:</h1>
            {listMessagesPrepared}
          </div>
        </div>
       );
     }

     return(
     <h1>EN ATTENTE DES listMessages</h1>
     );
   }
}

module.exports = Home;
