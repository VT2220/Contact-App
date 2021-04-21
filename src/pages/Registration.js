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
    formObj.id = uuid();
    dispatch(signup(formObj));
    setSuccessAlert(true);
  };

  const performValidation = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required Field";
    } else {
      const emailExist =
        registerData && registerData.find((d) => d.email === values.email);
      if (emailExist) {
        errors.email = "Email already exists";
      }
    }
    if (!values.password) {
      errors.password = "Required Field";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Required Field";
    } else {
      if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Password not match";
      }
    }

    return errors;
  };

  const [successAlert, setSuccessAlert] = useState(false);
  const onDismissSuccess = () => setSuccessAlert(false);

  return (
    <div className="centerElement">
      <div className="box">
        <img src={require("../images/logo.png").default} className="logo-img" />
        <div className="text-center mt-3 mb-2" style={{ fontSize: "1.1em" }}>
          <b>Registration</b>
        </div>
        <FinalForm
          onSubmit={(formObj) => {
            registerUser(formObj);
          }}
          validate={performValidation}
          render={({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Field name="email">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" id="email" {...input} />
                    {meta.error && meta.touched && (
                      <span className="errors ml-1 ">{meta.error} !</span>
                    )}
                  </FormGroup>
                )}
              </Field>
              <Field name="password">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" id="password" {...input} />
                    {meta.error && meta.touched && (
                      <span className="errors ml-1 ">{meta.error} !</span>
                    )}
                  </FormGroup>
                )}
              </Field>
              <Field name="confirmPassword">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input type="password" id="confirmPassword" {...input} />
                    {meta.error && meta.touched && (
                      <span className="errors ml-1 ">{meta.error} !</span>
                    )}
                  </FormGroup>
                )}
              </Field>
              <Button className="glass-btn">Register</Button>
              <Alert
                color="success"
                isOpen={successAlert}
                toggle={onDismissSuccess}
                className="mt-3"
                style={{ width: "236.4px" }}
              >
                Registeration successful. <Link to="/">Login here</Link>
              </Alert>
            </Form>
          )}
        />
      </div>
    </div>
  );
};

export default Registration;
