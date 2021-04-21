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

  const editContactFunction = (formObj) => {
    const loginId = loginData && loginData.id;
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

  const performValidation = (values) => {
    const errors = {};
    const loginId = loginData && loginData.id;
    if (values.checkbox) {
      setCheckbox(true);
    } else {
      setCheckbox(false);
    }

    if (!values.name) {
      errors.name = "Required Field";
    }
    if (!values.phonenumber) {
      errors.phonenumber = "Required Field";
    } else if (values.phonenumber.length !== 10) {
      errors.phonenumber = "Phone number must be of 10 digit only";
    } else {
      const userContacts =
        loginData && contactData[loginId].filter((d) => d.id !== id);
      const phoneNumberExist = userContacts.find(
        (d) => d.phonenumber === values.phonenumber
      );
      if (phoneNumberExist) {
        errors.phonenumber = "Phone number already exist";
      }
    }
    return errors;
  };

  useEffect(() => {
    dispatch(getContact(id));
  }, [id]);

  return (
    <div className="supreme-container">
      <Header />
      <div className="d-flex justify-content-center position-relative">
        <div className="box">
          <h6 className="text-center mb-2">
            <b>Edit Contact Info</b>
          </h6>
          <FinalForm
            onSubmit={(formObj) => editContactFunction(formObj)}
            validate={performValidation}
            initialValues={singleContactData}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field name="name">
                  {({ input, meta }) => (
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input type="name" id="name" {...input} />
                      {meta.error && meta.touched && (
                        <span className="text-danger ml-1 ">
                          {meta.error} !
                        </span>
                      )}
                    </FormGroup>
                  )}
                </Field>
                <Field name="phonenumber">
                  {({ input, meta }) => (
                    <FormGroup>
                      <Label for="phonenumber">Phone Number</Label>
                      <Input type="text" id="phonenumber" {...input} />
                      {meta.error && meta.touched && (
                        <span className="text-danger ml-1 ">
                          {meta.error} !
                        </span>
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
                    <Label className="btn glass-btn mr-3" for="photo">
                      Change Photo
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <img
                      src={
                        checkbox
                          ? require("../images/contactThumbnail.jpg").default
                          : preview
                          ? preview
                          : singleContactData.photo
                          ? singleContactData.photo
                          : require("../images/contactThumbnail.jpg").default
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
                <Button className="glass-btn mt-3">Edit contact</Button>{" "}
                <Button
                  onClick={() => history.push("/contact")}
                  className="glass-btn mt-3"
                >
                  Cancel
                </Button>
              </Form>
            )}
          />
        </div>
      </div>
      <img
        src={require("../images/list-background.png").default}
        id="reading-contact-img"
      />
      <img
        src={require("../images/list-background1.png").default}
        id="holding-phone-img"
      />
    </div>
  );
};

export default EditContact;
