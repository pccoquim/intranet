// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Modal from "react-modal";
import UserChangePassword from "./UserChangePassword";

Modal.setAppElement("#root");

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between">
      <div>
        <Link to="/" className="mr-4 hover:underline">Início</Link>
        <Link to="/about" className="mr-4 hover:underline">Sobre</Link>
        <Link to="/contact" className="mr-4 hover:underline">Contactos</Link>
        
        {user && (
          <Link
            to={user.is_admin ? "/adminDashboard" : "/userDashboard"}
            className="hover:underline"
          >
            Dashboard
          </Link>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Olá, {user.username}</span>
            <button
              onClick={openModal}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Alterar PW
            </button>
            <button
             onClick={logout}
             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/userLogin" className="mr-4 hover:underline">Login</Link>
            <Link to="/userRegister" className="hover:underline">Registar</Link>
          </>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Alterar palavra-passe"
        className="bg-white max-w-md mx-auto mt-24 rounded shadow p-4 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <UserChangePassword onClose={closeModal} />
      </Modal>
    </nav>
  );
};

export default Navbar;
