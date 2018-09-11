const React = require('react');
const Alert = require('react-bootstrap').Alert;
const Button = require('react-bootstrap').Button;
const Row = require('react-bootstrap').Row;
const Property = require('./Property');

class CreateProperty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {alert: false};

        this.refresh = this.refresh.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    refresh(msg, isError) {
        this.setState({ alert: {msg, isError} });
        this.props.refresh();
    }

    handleDismiss() {
        this.setState({ alert: false });
    }

    render() {

        let alert = null;
        if (this.state.alert) {
            alert = <Alert bsStyle={this.state.alert.isError ? 'danger' : 'success'} >
                <Row> {this.state.alert.msg} </Row>
                <Row> <Button onClick={this.handleDismiss}>Hide</Button> </Row>
            </Alert>
        }

        return <div>
                {alert}
                <Property refresh={this.refresh} onlyNewMode={true} />
            </div>
    }

}


module.exports = CreateProperty;
