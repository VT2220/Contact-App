import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { Form as FinalForm, Field } from "react-final-form";
import Header from "../components/Header";
import { useParams, useHistory } from "react-router-dom";
//ACTIONS
import { editContact, getContact } from "../action/actions";
//REDUX
import { useSelector, useDispatch } from "react-redux";

const EditContact = () => {
  const { singleContactData, loginData, contactData } = useSelector(
    (state) => state.contactReducer
  );

  const dispatch = useDispatch();

  const history = useHistory();
  const { id } = useParams();

  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [checkbox, setCheckbox] = useState(false);

  const [preview, setPreview] = useState();
  const showPreview = (e) => {
    var reader = new FileReader();
    const photo = document.querySelector("#photo");
    reader.readAsDataURL(photo.files[0]);
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
  };

  const onDismissError = () => setErrorAlert(false);

  const editContactFunction = (formObj) => {
    setErrorAlert(false);
    const loginId = loginData && loginData.id;

    if (!formObj.name || !formObj.phonenumber) {
      setErrorAlert(true);
      setErrorMsg("You have left one of the field empty");
      return;
    }

    if (formObj.phonenumber.length !== 10) {
      setErrorAlert(true);
      setErrorMsg("Phone number must be of 10 digit only");
      return;
    }

    const userContacts =
      loginData && contactData[loginId].filter((d) => d.id !== id);
    const phoneNumberExist = userContacts.find(
      (d) => d.phonenumber === formObj.phonenumber
    );

    if (phoneNumberExist) {
      setErrorAlert(true);
      setErrorMsg("Phone number already exist");
      return;
    }

    if (formObj.checkbox) {
      formObj.photo = null;
    } else {
      if (preview) {
        formObj.photo = preview;
      }
    }

    if (formObj.checkbox) {
      delete formObj.checkbox;
    }

    contactData[loginId] = contactData[loginId].filter((d) => d.id !== id);
    contactData[loginId].push(formObj);
    dispatch(editContact(contactData));
    history.push("/contact");
  };

  useEffect(() => {
    dispatch(getContact(id));
  }, [id]);

  return (
    <>
      <Header />
      <div className="centerElement">
        <div className="box">
          <h6 className="text-center text-danger">Edit Contact Info</h6>
          <FinalForm
            onSubmit={(formObj) => editContactFunction(formObj)}
            validate={(values) => {
              if (values.checkbox) {
                setCheckbox(true);
              } else {
                setCheckbox(false);
              }
            }}
            initialValues={singleContactData}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name">Name</Label>

                  <Field name="name">
                    {({ input }) => <Input type="name" id="name" {...input} />}
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
                    <Label id="fakeFileBtn" for="photo">
                      Upload New Photo
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <img
                      src={
                        checkbox
                          ? require("../images/contactThumbnail.png").default
                          : preview
                          ? preview
                          : singleContactData.photo
                          ? singleContactData.photo
                          : require("../images/contactThumbnail.png").default
                      }
                      width="80px"
                      height="80px"
                      className="rounded-circle"
                      style={{ objectFit: "cover" }}
                    />
                  </FormGroup>
                </div>
                <FormGroup check>
                  <Label check>
                    <Field name="checkbox">
                      {({ input }) => (
                        <Input type="checkbox" id="checkbox" {...input} />
                      )}
                    </Field>
                    Default Photo
                  </Label>
                </FormGroup>
                <Alert
                  color="danger"
                  isOpen={errorAlert}
                  toggle={onDismissError}
                  className="mt-3"
                >
                  {errorMsg}
                </Alert>
                <Button color="primary" className="rounded-pill mt-3">
                  Edit contact
                </Button>{" "}
                <Button
                  color="secondary"
                  onClick={() => history.push("/contact")}
                  className="rounded-pill mt-3"
                >
                  Cancel
                </Button>
              </Form>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default EditContact;
