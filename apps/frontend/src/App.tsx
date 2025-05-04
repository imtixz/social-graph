import Home from "./pages/Home";
import { Routes, Route } from "react-router";
import Contacts from "./pages/Contacts";
import AddContact from "./pages/AddContact";
import Login from "./pages/Login";
import ContactDetails from "./pages/ContactDetails";
import EditContact from "./pages/EditContact";

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/contacts/add" element={<AddContact />} />
      <Route path="/contacts/:contactId" element={<ContactDetails />} />
      <Route path="/contacts/edit/:contactId" element={<EditContact />} />
    </Routes>
  );
}

export default App;
