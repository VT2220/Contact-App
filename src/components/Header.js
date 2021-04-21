import React, { useState, useEffect } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { Form as FinalForm, Field } from "react-final-form";
import { v4 as uuid } from "uuid";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { addContact, getContact, signin } from "../action/actions";

const Header = () => {
  let history = useHistory();
  let location = useLocation();

  const { loginData, contactData } = useSelector((state) => {
    return state.contactReducer;
  });

  const dispatch = useDispatch();

  if (!loginData) {
    history.push("/");
  }

  const logout = () => {
    dispatch(signin(null));
    localStorage.removeItem("loginContact");

    history.push("/");
  };

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
    setPreview(null);
  };

  const [preview, setPreview] = useState();

  const showPreview = (e) => {
    var reader = new FileReader();
    const photo = e.target;
    reader.readAsDataURL(photo.files[0]);
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
  };

  const addContactFunction = (formObj) => {
    formObj.id = uuid();
    if (formObj.photo) {
      formObj.photo = preview;
    }
    dispatch(addContact(formObj, loginData.id));
    toggleModal();
  };

  useEffect(() => {
    if (location.pathname !== "/editcontact") {
      dispatch(getContact(""));
    }
  }, []);

  const required = (value) => (value ? undefined : "Required Field");

  const emailExist = (value) => {
    const id = loginData && loginData.id;
    const emailExist =
      contactData &&
      contactData[id] &&
      contactData[id].find((c) => c.email === value);
    return emailExist ? "Email already exist" : undefined;
  };

  const phoneNumberExist = (value) => {
    const id = loginData && loginData.id;
    const phoneNumberExist =
      contactData &&
      contactData[id] &&
      contactData[id].find((c) => c.phonenumber === value);
    return phoneNumberExist ? "Phone number already exist" : undefined;
  };

  const composeValidators = (...validators) => (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

  return (
    <>
      <Navbar className="glass-navbar">
        <div>
          <NavbarBrand>
            <Link
              to="/home"
              style={{
                textDecoration: "none",
                color: "black",
              }}
              className="d-flex"
            >
              <img
                src={require("../images/logo.png").default}
                width="50px"
                className="mr-3"
              />
              <span className="d-flex flex-column mt-1">
                Contacts{" "}
                <span
                  style={{
                    fontSize: ".5em",
                    lineHeight: ".7",
                    marginLeft: "2px",
                  }}
                >
                  {loginData && loginData.email}
                </span>
              </span>
            </Link>
          </NavbarBrand>
        </div>

        <span className="d-flex">
          {location.pathname === "/contact" && (
            <Nav className="mx-2">
              <NavItem>
                <NavLink
                  style={{
                    color: "black",
                    cursor: "pointer",
                  }}
                  onClick={toggleModal}
                >
                  Add contact
                </NavLink>
              </NavItem>
            </Nav>
          )}
          <Link className="btn glass-btn" onClick={logout}>
            Logout
          </Link>
        </span>
      </Navbar>
      <Modal isOpen={modal} toggle={toggleModal} className="popUpModal">
        <ModalHeader>Add contact</ModalHeader>

        <FinalForm
          onSubmit={(formObj) => {
            addContactFunction(formObj);
          }}
          render={({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <Field name="name" validate={required}>
                  {({ input, meta }) => (
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input type="name" id="name" {...input} />
                      {meta.error && meta.touched && (
                        <span className="ml-1 errors">{meta.error} !</span>
                      )}
                    </FormGroup>
                  )}
                </Field>
                <Field
                  name="email"
                  validate={composeValidators(required, emailExist)}
                >
                  {({ input, meta }) => (
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input type="email" id="email" {...input} />
                      {meta.error && meta.touched && (
                        <span className="ml-1 errors">{meta.error} !</span>
                      )}
                    </FormGroup>
                  )}
                </Field>
                <Field
                  name="phonenumber"
                  validate={composeValidators(required, phoneNumberExist)}
                >
                  {({ input, meta }) => (
                    <FormGroup>
                      <Label for="phonenumber">Phone Number</Label>
                      <Input type="text" id="phonenumber" {...input} />
                      {meta.error && meta.touched && (
                        <span className="ml-1 errors">{meta.error} !</span>
                      )}
                    </FormGroup>
                  )}
                </Field>
                <Label>Photo</Label>
                <div className="d-flex justify-content-between align-items-center">
                  <FormGroup>
                    <Field name="photo">
                      {({ input }) => (
                        <input
                          type="file"
                          id="photo"
                          name={input.name}
                          // value={input.value}
                          onChange={(e) => {
                            input.onChange(e);
                            showPreview(e);
                          }}
                          hidden
                        />
                      )}
                    </Field>
                    <Label className="btn glass-btn" for="photo">
                      Upload Photo
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    {preview && (
                      <img
                        src={preview}
                        width="80px"
                        height="80px"
                        className="rounded-circle"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </FormGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button class="glass-btn">Add contact</Button>{" "}
                <Button onClick={toggleModal} class="glass-btn">
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        />
      </Modal>
    </>
  );
};

export default Header;
