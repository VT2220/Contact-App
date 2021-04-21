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
        <img src={require("../images/logo.png").default} className="logo-img" />
        <div className="text-center mt-3 mb-2" style={{ fontSize: "1.1em" }}>
          <b>Login</b>
        </div>
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
              <Button className="glass-btn">Login</Button>
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
          Don't have account,{" "}
          <Link
            to="/registration"
            style={{ color: "rgba(230, 24, 24, 0.63)", textDecoration: "none" }}
          >
            register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
