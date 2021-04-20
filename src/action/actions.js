import {
  SIGNIN,
  SIGNUP,
  ADD_CONTACT,
  EDIT_CONTACT,
  DELETE_CONTACT,
  GET_CONTACT,
} from "./action-types";

export const signin = (user) => {
  localStorage.setItem("loginContact", JSON.stringify(user));
  return {
    type: SIGNIN,
    payload: user,
  };
};

export const signup = (user) => {
  let localRegisterData = JSON.parse(localStorage.getItem("registerContact"));
  if (localRegisterData) {
    localRegisterData.push(user);
  } else {
    localRegisterData = [user];
  }
  localStorage.setItem("registerContact", JSON.stringify(localRegisterData));
  return {
    type: SIGNUP,
    payload: localRegisterData,
  };
};

export const addContact = (contact, id) => {
  let localContactData = JSON.parse(localStorage.getItem("contactData"));
  localContactData = localContactData ? localContactData : {};
  if (localContactData[id]) {
    localContactData[id].push(contact);
  } else {
    localContactData[id] = [contact];
  }
  localStorage.setItem("contactData", JSON.stringify(localContactData));
  return {
    type: ADD_CONTACT,
    payload: localContactData,
  };
};

export const editContact = (contact) => {
  localStorage.setItem("contactData", JSON.stringify(contact));
  return {
    type: EDIT_CONTACT,
    payload: contact,
  };
};

export const deleteContact = (contact) => {
  localStorage.setItem("contactData", JSON.stringify(contact));
  return {
    type: DELETE_CONTACT,
    payload: contact,
  };
};

export const getContact = (id) => {
  return {
    type: GET_CONTACT,
    payload: id,
  };
};
