const React = require('react');
const Button = require('react-bootstrap').Button;
const Alert = require('react-bootstrap').Alert;
const Row = require('react-bootstrap').Row;

const propertyDal = require('../services/propertyDal');
const Property = require('./Property');
const logger = require('../services/logger');

class PropertiesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { properties: [] };
        this.fetchProperties = this.fetchProperties.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    fetchProperties(alert) {
        logger.debug('loaded tasks');

        propertyDal.get()
            .then( properties =>{
                if (alert) {
                    return this.setState({properties, alert});
                }

                return this.setState({properties});
            })
            .catch( err => {
                logger.error('Error while fetching properties', err);
                this.setState('Unable to fetch properties', true);
            });
    }

    handleDismiss() {
        this.setState({ alert: false });
    }

    componentDidMount() {
        logger.debug("mounted task list");
        this.fetchProperties();
    }

    refreshList(msg, isError) {
        if (msg) {
            this.fetchProperties({msg, isError});
        }
        this.fetchProperties();
    }

    render() {
        let alert = null;
        if (this.state.alert) {
            alert = <Alert bsStyle={this.state.alert.isError ? 'danger' : 'success'} >
                <Row> {this.state.alert.msg} </Row>
                <Row> <Button onClick={this.handleDismiss}>Hide</Button> </Row>
            </Alert>
        }

        const properties = this.state.properties.map( p => <div key={p.owner}>
            <Property data={p} refresh={this.refreshList} />
            <hr/>
        </div>);

        return <div>
            {alert}
            {properties}
        </div>
    }
}

module.exports = PropertiesList;
