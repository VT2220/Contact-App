import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { Form as FinalForm, Field } from "react-final-form";
import { useHistory, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { signup } from "../action/actions";

const Registration = () => {
  const { loginData, registerData } = useSelector(
    (state) => state.contactReducer
  );

  const dispatch = useDispatch();

  let history = useHistory();
  if (loginData) {
    history.push("/contact");
  }

  const registerUser = (formObj) => {
    setSuccessAlert(false);
    setErrorAlert(false);
    if (!formObj.email || !formObj.password || !formObj.confirmPassword) {
      setErrorAlert(true);
      setErrorMsg("You have left one of the field empty");
      return;
    }

    const emailExist =
      registerData && registerData.find((d) => d.email === formObj.email);
    if (emailExist) {
      setErrorAlert(true);
      setErrorMsg("Email already exists");
    } else {
      if (formObj.password !== formObj.confirmPassword) {
        setErrorAlert(true);
        setErrorMsg("Password and confirm-password are not same");
        return;
      }
      formObj.id = uuid();
      dispatch(signup(formObj));
      setSuccessAlert(true);
    }
  };

  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onDismissSuccess = () => setSuccessAlert(false);
  const onDismissError = () => setErrorAlert(false);

  return (
    <div className="centerElement">
      <div className="box">
        <h6 className="text-center">
          <b>Registration</b>
        </h6>
        <FinalForm
          onSubmit={(formObj) => {
            registerUser(formObj);
          }}
          render={({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Field name="email">
                  {({ input }) => <Input type="email" id="email" {...input} />}
                </Field>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Field name="password">
                  {({ input }) => (
                    <Input type="password" id="password" {...input} />
                  )}
                </Field>
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword">Confirm Password</Label>
                <Field name="confirmPassword">
                  {({ input }) => (
                    <Input type="password" id="confirmPassword" {...input} />
                  )}
                </Field>
              </FormGroup>
              <Button color="primary" className="rounded-pill">
                Register
              </Button>
              <Alert
                color="success"
                isOpen={successAlert}
                toggle={onDismissSuccess}
                className="mt-3"
                style={{ width: "236.4px" }}
              >
                Registeration successful. <Link to="/">Login here</Link>
              </Alert>
              <Alert
                color="danger"
                isOpen={errorAlert}
                toggle={onDismissError}
                className="mt-3"
                style={{ width: "236.4px" }}
              >
                {errorMsg}
              </Alert>
            </Form>
          )}
        />
      </div>
    </div>
  );
};

export default Registration;
