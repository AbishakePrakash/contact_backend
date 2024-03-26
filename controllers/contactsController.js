const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @GET - Get All Contacts      @path - /api/contacts           @access - private
const GET_ALL_CONTACTS = asyncHandler(async (req, res) => {
  const contact = await Contact.find();
  res.status(200).json(contact);
});

// @GET - Get 1 Contact by ID   @path - /api/contacts/:id       @access - privateonly
const GET_CONTACT = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  // if (contact.user_id.toString() !== req.user.id ) {
  //     res.status(403);
  //     throw new Error("You don't have permission to view or make changes in other user contacts")
  // }

  res.status(200).json(contact);
});

// @POST - Create a Contact     @path - /api/contacts           @access - private
const CREATE_CONTACT = asyncHandler(async (req, res) => {
  // console.log("The requested body is ", req.body, 'Req', req);
  // console.log('userdata', req);
  const { name, email, phone, tag } = req.body;
  if (!name || !email || !phone || !tag) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    tag,
    user_id,
  });

  res.status(201).json(contact);
});

// @PUT - Update a Contact      @path - /api/contacts/:id       @access - private
const UPDATE_CONTACT = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "You don't have permission to view or make changes in other user contacts"
    );
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // console.log("Contact updated successfully");
  res.status(200).json(updatedContact);
});

// @DELETE - Delete a Contact   @path - /api/contacts/:id       @access - private
const DELETE_CONTACT = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "You don't have permission to view or make changes in other user contacts"
    );
  }

  try {
    await Contact.deleteOne({ _id: req.params.id });
    // console.log("Contact deleted");
  } catch (error) {
    // console.log("error", error);
  }
  res.status(200).json(contact);
});

module.exports = {
  GET_ALL_CONTACTS,
  GET_CONTACT,
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
};
