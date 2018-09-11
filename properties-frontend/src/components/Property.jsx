const React = require('react');

const propertyDal = require('../services/propertyDal');

const _ = require('lodash');

const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const FormControl = require('react-bootstrap').FormControl;
const FormGroup = require('react-bootstrap').FormGroup;
const ControlLabel = require('react-bootstrap').ControlLabel;
const Button = require('react-bootstrap').Button;

const logger = require('../services/logger');

const HttpStatus = require('http-status-codes');

class Property extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data || {},
            fieldErrors: {}
        }

        this.refresh = this.props.refresh;
        this.onlyNewMode = this.props.onlyNewMode;

        this.delete = this.delete.bind(this);
        this.save = this.save.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getOwner = this.getOwner.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.formId = this.formId.bind(this);
    }

    save() {

        let savePromise = null;
        if (this.onlyNewMode ) {
            savePromise = propertyDal.create(this.state.data)
                .then( () => this.clearForm());
        } else {
            savePromise = propertyDal.update(this.getOwner(), this.state.data);
        }

        return savePromise
            .then( () =>  {
                this.setState({editMode: false});
                this.props.refresh(`Operation success for property with owner ${this.getOwner()}`, false)
            })
            .catch( err => {

                if ( err.response && err.response.status === HttpStatus.BAD_REQUEST ) {
                    // array with errors to map
                    // we are going to use backend validation but for normal frontend app
                    // we should have some validation before sending data
                    const fieldErrors = err.response.data.details.reduce( (acc, val) =>{
                        return Object.assign(acc, { [val.field]: val.message})
                    }, {});

                    return this.setState({ fieldErrors });
                }

                logger.error("Could not update/save property. ", err);
                const errMsg = _.get(err, 'response.data.msg', 'Unknown error');
                this.props.refresh(`Operations failed for property with owner ${this.getOwner()}. ${errMsg}`, true);
            });
    }

    delete() {
        return propertyDal.delete(this.getOwner())
                .then( () => this.props.refresh(`Deleted property for owner ${this.getOwner()}`, false))
                .catch( err => {
                    logger.error("Could not delete property. ", err);
                    this.props.refresh(`Could not delete property for owner ${this.getOwner()}`, true);
                });
    }

    getOwner() {
        return this.state.data.owner;
    }

    toggleEdit() {
        this.setState({editMode: !this.state.editMode})
    }

    handleChange(path) {
        return e => {
            const value = e.target.value;
            _.set(this.state.data, path, value);
            this.setState(this.state.data);
        }
    }

    clearForm() {
        document.getElementById(this.formId()).reset();
        this.setState({data:{}})
    }

    renderField(label, fieldPath, type = 'text') {
        const value = _.get(this.state.data, fieldPath);

        if ( this.state.editMode || this.onlyNewMode ) {
            let errorMsg = null;
            if( this.state.fieldErrors[fieldPath] ) {
                errorMsg = <span className='red-text'>{this.state.fieldErrors[fieldPath]}</span>
            }

            return <FormGroup controlId={fieldPath}>

                <ControlLabel>{label}</ControlLabel>
                <FormControl
                    type={type}
                    value={value}
                    placeholder={value}
                    onChange={this.handleChange(fieldPath)} />
                <FormControl.Feedback />
                {errorMsg}
           </FormGroup>
        }

        return `${label}: ${value || ''}`;
    }

    formId() {
        return `form-${this.state.data.owner || 'new-property'}`
    }

    render() {

        let saveBtn = null;
        if ( this.state.editMode || this.onlyNewMode ) {
            saveBtn = <Button bsStyle='warning' className='btn-block' onClick={this.save}>Save</Button>
        }

        return <form id={this.formId()}>
            <Row>

                <Col xs={12} md={5} >
                    <Row>Property:</Row>
                    <Row>{this.renderField('Owner', 'owner')}</Row>
                    <Row>{this.renderField('Number of bedrooms', 'numberOfBedRooms', 'number')}</Row>
                    <Row>{this.renderField('Number of bathrooms', 'numberOfBathRooms', 'number')}</Row>
                    <Row>{this.renderField('Airbnb ID', 'airbnbID')}</Row>
                    <Row>{this.renderField('Income', 'incomeGenerated', 'number')}</Row>
                </Col>

                <Col xs={12} md={5}>
                    <Row>Address:</Row>
                    <Row>{this.renderField('Line 1', 'address.line1')}</Row>
                    <Row>{this.renderField('Line 2', 'address.line2')}</Row>
                    <Row>{this.renderField('Line 3', 'address.line3')}</Row>
                    <Row>{this.renderField('Line 4', 'address.line4')}</Row>
                    <Row>{this.renderField('Post code', 'address.postCode')}</Row>
                    <Row>{this.renderField('City', 'address.city')}</Row>
                    <Row>{this.renderField('Country', 'address.country')}</Row>
                </Col>

                <Col xs={12} md={2}>
                    { !this.onlyNewMode &&
                        <div>
                        <Row><Button bsStyle="danger" className='btn-block' onClick={this.delete}>Delete</Button></Row>
                        <Row><Button bsStyle="primary" className='btn-block' onClick={this.toggleEdit}>Toggle edit mode</Button></Row>
                        </div>
                    }
                    <Row> {saveBtn} </Row>
                </Col>

            </Row>
        </form>
    }
}

module.exports = Property;
