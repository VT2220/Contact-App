import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Header from "../components/Header";
import {
  Container,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from "reactstrap";
import { useHistory } from "react-router-dom";
//ICONS
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
//REDUX
import { useSelector, useDispatch } from "react-redux";
//ACTIONS
import { deleteContact } from "../action/actions";

const Contact = () => {
  const { loginData, contactData } = useSelector(
    (state) => state.contactReducer
  );

  const id = loginData && loginData.id;

  const userContacts = contactData && contactData[id] ? contactData[id] : [];

  const history = useHistory();

  const dispatch = useDispatch();

  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  const [clickedId, setClickedId] = useState();

  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const deleteContactFunction = () => {
    contactData[id] = contactData[id].filter((d) => d.id !== clickedId);
    dispatch(deleteContact(contactData));
    toggleDeleteModal();
  };

  return (
    <>
      <Header />
      <Container className="mt-5">
        {userContacts.length ? (
          <div>
            {isDesktop ? (
              <Table hover className="contact-list-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Ph. no.</th>
                    <th>Email</th>
                    <th>Edit/Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {userContacts.map((c, index) => (
                    <tr key={index}>
                      <td>
                        {c.photo ? (
                          <img
                            src={c.photo}
                            width="40px"
                            height="40px"
                            className="rounded-circle"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <img
                            src={
                              require("../images/contactThumbnail.png").default
                            }
                            width="40px"
                            height="40px"
                            className="rounded-circle"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </td>
                      <td className="mx-3">{c.name}</td>

                      <td>{c.phonenumber}</td>
                      <td>{c.email}</td>
                      <td
                        sm="12"
                        md="auto"
                        // className="text-right"
                        style={{ fontSize: "1.5em" }}
                      >
                        <AiOutlineEdit
                          className="mx-3 updateBtns"
                          onClick={() => {
                            // dispatch(getContact(c.id));
                            history.push(`/editcontact/${c.id}`);
                          }}
                        />
                        <AiOutlineDelete
                          className="updateBtns"
                          onClick={() => {
                            setClickedId(c.id);
                            toggleDeleteModal();
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <ListGroup>
                {userContacts.map((c, index) => (
                  <ListGroupItem key={index} action>
                    <Row>
                      <Col>
                        <span className="d-flex">
                          {c.photo ? (
                            <img
                              src={c.photo}
                              className="rounded-circle contact-img"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <img
                              src={
                                require("../images/contactThumbnail.png")
                                  .default
                              }
                              className="rounded-circle contact-img"
                              style={{ objectFit: "cover" }}
                            />
                          )}
                          <span className="d-flex flex-column mx-3">
                            <span className="list-name">{c.name}</span>
                            <span className="list-text">{c.phonenumber}</span>
                            <span className="list-text">{c.email}</span>
                          </span>
                        </span>
                      </Col>
                      <Col
                        className="d-flex align-items-center justify-content-end"
                        style={{ fontSize: "1.5em" }}
                      >
                        <AiOutlineEdit
                          className="updateBtns mr-3"
                          onClick={() => {
                            history.push(`/editcontact/${c.id}`);
                          }}
                        />
                        <AiOutlineDelete
                          className="updateBtns"
                          onClick={() => {
                            setClickedId(c.id);
                            toggleDeleteModal();
                          }}
                        />
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </div>
        ) : (
          <div className="text-center">You have no contact saved</div>
        )}
      </Container>

      {/* DELETEMODAL */}
      <Modal
        isOpen={deleteModal}
        toggle={toggleDeleteModal}
        className="popUpModal"
      >
        <ModalHeader toggle={toggleDeleteModal}>Delete Contact</ModalHeader>
        <ModalBody>Are you sure you want to delete this contact ?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={deleteContactFunction}>
            Delete
          </Button>{" "}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Contact;
