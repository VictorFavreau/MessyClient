var React = require("react");
var ReactDOM = require("react-dom");

class Timer extends React.Component {
 
 constructor(props) {
    super(props);
    var date = new Date();
    this.state = { heure: date.getHours(), minute: date.getMinutes(), seconde: date.getSeconds() };
  }

  getDate(){
     var date = new Date();
     this.setState({ heure: date.getHours(), minute: date.getMinutes(), seconde: date.getSeconds() });
  }

  componentDidMount() {
    this.interval = setInterval(() => this.getDate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    var spanStyle = {
       color: 'red'
    };

    var h1Style = {
       textAlign: 'center'
    };

    return (
      <div>
        <h1 style={h1Style}>Il est: <span>{this.state.heure}</span>:<span style={spanStyle}>{this.state.minute}</span>:<span>{this.state.seconde}</span></h1>
      </div>
    );
  }
}

ReactDOM.render(<Timer />, document.getElementById('clock'));
