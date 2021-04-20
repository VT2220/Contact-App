import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { Form as FinalForm, Field } from "react-final-form";
import { useHistory, Link } from "react-router-dom";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { signin } from "../action/actions";

const Login = () => {
  const { loginData, registerData } = useSelector((state) => {
    return state.contactReducer;
  });

  const dispatch = useDispatch();

  let history = useHistory();
  if (loginData) {
    history.push("/contact");
  }

  const loginUser = (formObj) => {
    if (!formObj.email || !formObj.password) {
      setErrorAlert(true);
      setErrorMsg("You have left one of the field empty");
      return;
    }

    const user =
      registerData && registerData.find((d) => d.email === formObj.email);
    if (user) {
      if (formObj.password === user.password) {
        formObj.id = user.id;
        dispatch(signin(formObj));
        history.push("/contact");
      } else {
        setErrorAlert(true);
        setErrorMsg("Incorrect password");
      }
    } else {
      setErrorAlert(true);
      setErrorMsg("No user exist with this email");
    }
  };

  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const onDismissError = () => setErrorAlert(false);

  return (
    <div className="centerElement">
      <div className="box">
        <h6 className="text-center text-danger">Login</h6>
        <FinalForm
          onSubmit={(formObj) => {
            loginUser(formObj);
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
              <Button color="primary" className="rounded-pill">
                Login
              </Button>
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
        <div className="text-center mt-3">
          Don't have account, <Link to="/registration">register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
