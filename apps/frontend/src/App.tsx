import Home from "./pages/Home";
import { Routes, Route } from "react-router";
import Contacts from "./pages/Contacts";
import AddContact from "./pages/AddContact";
import Login from "./pages/Login";
import ContactDetails from "./pages/ContactDetails";
import EditContact from "./pages/EditContact";
import AddInteraction from "./pages/AddInteraction";
import Interactions from "./pages/Interactions";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import AddReminder from "./pages/AddReminder";

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/contacts/add" element={<AddContact />} />
      <Route path="/contacts/:contactId" element={<ContactDetails />} />
      <Route path="/contacts/edit/:contactId" element={<EditContact />} />
      <Route path="/interactions" element={<Interactions />} />
      <Route path="/interactions/add" element={<AddInteraction />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/reminders/create" element={<AddReminder />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
