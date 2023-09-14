import React, { useEffect, useReducer, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ToastComponent from "./ToastComponent";
import { storeCompany, updateCompany } from "../services/company.service";
import { checkDisableButton } from "../utility/utils";
import { DATA_CREATE_SUCCESS, DATA_CREATE_FAILED, DATA_UPDATE_FAILED } from "../config/constants";

// addCallback,
const AddUpdateForm = ({ updateData, updateCallback,  loaderCallback }) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [isUpdate, setIsUpdate] = useState(false);

    // company add / update form
    const [formInput, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            name: {
                value: "",
                isValid: false,
                helperText: "",
                touched: false,
                minLength: 1
            },
            registration_code: {
                value: "",
                isValid: false,
                helperText: "",
                touched: false,
                minLength: 6
            },
            vat: {
                value: "",
                isValid: false,
                helperText: "",
                touched: false,
                minLength: 1
            },
            mobile_phone: {
                value: "",
                isValid: false,
                helperText: "",
                touched: false,
                minLength: 1
            },
            address: {
                value: "",
                isValid: false,
                helperText: "",
                touched: false,
                minLength: 1
            },
        }
    );
    const inputKeys = Object.keys(formInput);

    /**  populate the form for update action  */
    useEffect(() => {
        if (updateData.id) {
            setIsUpdate(true);
            const formData = { ...formInput };

            for (const key in formData) {
                if (updateData[key] !== undefined) {
                    formData[key].value = updateData[key];
                    formData[key].isValid = true;
                }
            }

            setFormInput(formData);
        }
        // eslint-disable-next-line
    }, [updateData]);

    const formValidation = (input, inputIdentifier) => {
        const regex = /^[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;
        const isValid = regex.test(input.value);
        switch (inputIdentifier) {
            case 'registration_code':
                input.isValid = input.value.length >= input.minLength && isValid;
                input.helperText = !input.isValid ? 'Registration code is required (only digits are allowed)' : '';
                break;
            case 'name':
                input.isValid =  input.value.length >= input.minLength;
                input.helperText = !input.isValid ? "Name can't be empty" : '';
                break;
            case 'vat':
                input.isValid = input.value.length >= input.minLength && isValid;
                input.helperText = !input.isValid ? "VAT can't be empty" : '';
                break;
            case 'address':
                input.isValid = input.value.length >= input.minLength;
                input.helperText = !input.isValid ? "Address can't be empty" : '';
                break;
            case 'mobile_phone':
                input.isValid = input.value.length >= input.minLength;
                input.helperText = !input.isValid ? "Mobile Phone can't be empty" : '';
                break;
            default:
                break;
        }

        setFormInput({
            ...formInput,
            [inputIdentifier]: input
        });
    };

    // to enable/disable submit button
    useEffect(() => {
        setIsDisabled(checkDisableButton(formInput));
    }, [formInput]);

    // handle form input validation
    const handleInput = (event, inputIdentifier) => {
        const input = formInput[inputIdentifier];
        input.value = event.target.value;
        input.touched = true;
        formValidation(input, inputIdentifier);
    };

    // reset form after submit successful or cancel button click
    const resetForm = () => {
        const formData = { ...formInput };
        for (let item in formData) {
            formData[item].value = '';
            formData[item].isValid = false;
            formData[item].touched = false;
        }
        setFormInput({ ...formInput, ...formData });
        setIsUpdate(false);
    };


    // create new entry API call
    const create = async event => {
        event.preventDefault();
        const formData = {};
        for (let item in formInput) {
            formData[item] = formInput[item].value;
        }
        // to start loader
        loaderCallback(true);
        await storeCompany(formData)
            .then(response => {
                resetForm();
                // addCallback(response.data.data);
                toast.success(<ToastComponent messages={DATA_CREATE_SUCCESS} />);
            })
            .catch(error => {
                const errorMessage = error?.response?.data?.error ?? DATA_CREATE_FAILED;
                loaderCallback(false);
                toast.error(<ToastComponent messages={errorMessage}/>);
            });
    };

    /**
     * Update API call, reset form to create mood, update data in table
     * @param event
     * @returns {Promise<void>}
     */
    const update = async event => {
        event.preventDefault();
        const formData = {};
        for (let item in formInput) {
            formData[item] = formInput[item].value;
        }

        loaderCallback(true);

        await updateCompany(formData, updateData.id)
            .then(response => {
                updateData = {
                    ...updateData,
                    ...formData,
                };
                updateCallback(updateData);
                resetForm();
                toast.success(<ToastComponent messages={response.data.message} />);
            })
            .catch(error => {
                const errorMessage = error?.response?.data?.message ?? DATA_UPDATE_FAILED;
                loaderCallback(false);
                toast.error(<ToastComponent messages={errorMessage}/>);
            });
    };

    return (
        <div>
            <ToastContainer position={"top-right"}
                            autoClose={3000}
                            hideProgressBar={false}
                            closeOnClick
                            pauseOnFocusLoss
                            draggable/>


            <Form className="text-left" onSubmit={updateData.id ? update : create}>
                {/*Registration code*/}
                <Form.Group className="mb-3" controlId="formCode">
                    <Form.Label> Registration Code <span style={{ color: 'red' }}> * </span> </Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control type="text" placeholder="Ex: 123456"
                                      isInvalid={formInput.registration_code.touched && !formInput.registration_code.isValid}
                                      name={formInput.registration_code.name} value={formInput.registration_code.value}
                                      onChange={event => handleInput(event, inputKeys[1])}/>
                        {
                            formInput.registration_code.touched && !formInput.registration_code.isValid ?
                                <Form.Control.Feedback type="invalid">
                                    {formInput.registration_code.helperText}
                                </Form.Control.Feedback> : <></>
                        }
                    </InputGroup>
                </Form.Group>

                {/*Name*/}
                <Form.Group className="mb-3" controlId="formName" style={{ display: isUpdate ? 'block' : 'none'}}>
                    <Form.Label> Name  </Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control type="text" placeholder="Ex: Company Name"
                                      isInvalid={isUpdate && formInput.name.touched && !formInput.name.isValid}
                                      name={formInput.name.name} value={formInput.name.value}
                                      onChange={event => handleInput(event, inputKeys[0])}/>
                        {
                            isUpdate && formInput.name.touched && !formInput.name.isValid ?
                                <Form.Control.Feedback type="invalid">
                                    {formInput.name.helperText}
                                </Form.Control.Feedback> : <></>
                        }
                    </InputGroup>
                </Form.Group>

                {/*VAT*/}
                <Form.Group className="mb-3" controlId="formVat" style={{ display: isUpdate ? 'block' : 'none'}}>
                    <Form.Label>Vat  </Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control type="text" placeholder="Ex: 9123456"
                                      isInvalid={isUpdate && formInput.vat.touched && !formInput.vat.isValid}
                                      name={formInput.vat.name} value={formInput.vat.value}
                                      onChange={event => handleInput(event, inputKeys[2])}/>
                        {
                            isUpdate && formInput.vat.touched && !formInput.vat.isValid ?
                                <Form.Control.Feedback type="invalid">
                                    {formInput.vat.helperText}
                                </Form.Control.Feedback> : <></>
                        }
                    </InputGroup>
                </Form.Group>

                {/*Address*/}
                <Form.Group className="mb-3" controlId="formAddress" style={{ display: isUpdate ? 'block' : 'none'}}>
                    <Form.Label> Address  </Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control type="text" placeholder="Ex: House, Road, state"
                                      isInvalid={isUpdate && formInput.address.touched && !formInput.address.isValid}
                                      name={formInput.address.name} value={formInput.address.value}
                                      onChange={event => handleInput(event, inputKeys[4])}/>
                        {
                            isUpdate && formInput.address.touched && !formInput.address.isValid ?
                                <Form.Control.Feedback type="invalid">
                                    {formInput.address.helperText}
                                </Form.Control.Feedback> : <></>
                        }
                    </InputGroup>
                </Form.Group>

                {/*Mobile Phone*/}
                <Form.Group className="mb-3" controlId="formPhone" style={{ display: isUpdate ? 'block' : 'none'}}>
                    <Form.Label> Mobile Phone  </Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control type="text" placeholder="Ex: http://xyz.com"
                                      isInvalid={isUpdate && formInput.mobile_phone.touched && !formInput.mobile_phone.isValid}
                                      name={formInput.mobile_phone.name} value={formInput.mobile_phone.value}
                                      onChange={event => handleInput(event, inputKeys[3])}/>
                        {
                            isUpdate && formInput.mobile_phone.touched && !formInput.mobile_phone.isValid ?
                                <Form.Control.Feedback type="invalid">
                                    {formInput.mobile_phone.helperText}
                                </Form.Control.Feedback> : <></>
                        }
                    </InputGroup>
                </Form.Group>

                {   updateData.id ?
                    <Button variant="secondary" type="button" className="float-right" style={{ marginLeft: '10px'}}
                    onClick={() => resetForm()}>
                        Cancel
                    </Button> : <></>
                }
                <Button variant="primary" type="submit" className="float-right"
                        disabled={isDisabled}>
                    {updateData.id ? 'Update' : 'Submit'}
                </Button>


            </Form>
        </div>

    );
};

export default AddUpdateForm;
