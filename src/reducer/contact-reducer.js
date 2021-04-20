let localRegisterData = JSON.parse(localStorage.getItem("registerContact"));
localRegisterData = localRegisterData ? localRegisterData : [];
const localLoginData = JSON.parse(localStorage.getItem("loginContact"));
const localContactData = JSON.parse(localStorage.getItem("contactData"));

const initialState = {
  registerData: localRegisterData,
  loginData: localLoginData,
  contactData: localContactData,
  singleContactData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SIGNIN":
      return { ...state, loginData: action.payload };
    case "SIGNUP":
      return { ...state, registerData: action.payload };
    case "ADD_CONTACT":
    case "EDIT_CONTACT":
    case "DELETE_CONTACT":
      return { ...state, contactData: action.payload };
    case "GET_CONTACT":
      const id = state.loginData.id;
      let contact =
        state.contactData[id] &&
        state.contactData[id].find((d) => d.id === action.payload);
      contact = contact ? contact : {};
      return { ...state, singleContactData: contact };
    default:
      return state;
  }
};
