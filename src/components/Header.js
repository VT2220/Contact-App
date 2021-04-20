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
    setErrorAlert(false);
    setPreview(null);
  };

  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onDismissError = () => setErrorAlert(false);

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
    if (!formObj.name || !formObj.email || !formObj.phonenumber) {
      setErrorAlert(true);
      setErrorMsg("You have left one of the field empty");
      return;
    }

    if (formObj.phonenumber.length !== 10) {
      setErrorAlert(true);
      setErrorMsg("Phone number must be of 10 digit only");
      return;
    }

    const id = loginData && loginData.id;
    const emailExist =
      contactData &&
      contactData[id] &&
      contactData[id].find((c) => c.email === formObj.email);
    if (emailExist) {
      setErrorAlert(true);
      setErrorMsg("Email already exist");
      return;
    }
    const phoneNumberExist =
      contactData &&
      contactData[id] &&
      contactData[id].find((c) => c.phonenumber === formObj.phonenumber);
    if (phoneNumberExist) {
      setErrorAlert(true);
      setErrorMsg("Phone number already exist");
      return;
    }

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

  return (
    <>
      <Navbar color="primary">
        <div>
          <NavbarBrand>
            <Link
              to="/home"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <span className="d-flex flex-column">
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
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={toggleModal}
                >
                  Add contact
                </NavLink>
              </NavItem>
            </Nav>
          )}
          <Link className="btn btn-danger rounded-pill" onClick={logout}>
            Logout
          </Link>
        </span>
      </Navbar>
      <Modal isOpen={modal} toggle={toggleModal} className="popUpModal">
        <ModalHeader toggle={toggleModal}>Add contact</ModalHeader>

        <FinalForm
          onSubmit={(formObj) => {
            addContactFunction(formObj);
          }}
          render={({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Field name="name">
                    {({ input }) => <Input type="name" id="name" {...input} />}
                  </Field>
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Field name="email">
                    {({ input }) => (
                      <Input type="email" id="email" {...input} />
                    )}
                  </Field>
                </FormGroup>
                <FormGroup>
                  <Label for="phonenumber">PhoneNumber</Label>
                  <Field name="phonenumber">
                    {({ input }) => (
                      <Input type="text" id="phonenumber" {...input} />
                    )}
                  </Field>
                </FormGroup>
                <div className="d-flex justify-content-between">
                  <FormGroup>
                    <Label for="photo">Photo</Label>

                    <Field name="photo">
                      {({ input }) => (
                        <Input
                          type="file"
                          id="photo"
                          name={input.name}
                          // value={input.value}
                          onChange={(e) => {
                            input.onChange(e);
                            showPreview(e);
                          }}
                        />
                      )}
                    </Field>
                    {/* <Input type="file" id="photo"  /> */}
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
                {/* <Alert
                  color="success"
                  isOpen={successAlert}
                  toggle={onDismissSuccess}
                  className="mt-3"
                >
                  Contact created successfully.
                </Alert> */}
                <Alert
                  color="danger"
                  isOpen={errorAlert}
                  toggle={onDismissError}
                  className="mt-3"
                >
                  {errorMsg}
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" className="rounded-pill">
                  Add contact
                </Button>{" "}
                <Button
                  color="secondary"
                  onClick={toggleModal}
                  className="rounded-pill"
                >
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

// const mapStateToProps = (state) => ({
//   loginData: state.contactReducer.loginData,
//   contactData: state.contactReducer.contactData,
// });

// const mapDispatchToProps = (dispatch) => ({
//   signin: (user) => {
//     dispatch(signin(user));
//   },
//   addContact: (contact) => {
//     dispatch(addContact(contact));
//   },
// });

export default Header;
