import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = ({ isLogin, onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navigateTo = (url) => {
    navigate(url);
  };

  const buttonHandlerClick = () => {
    if (isLogin === "Login") {
      navigate("/login");
    } else {
      alert("Logout success");
      onLogout();
      navigate("/");
    }
  };

  const onHamburgerHandler = () => {
    setOpen(!open);
  };

  const onPostHandler = () => {
    if (isLogin === "Login") {
      alert("Anda harus LOGIN terlebih dahulu untuk dapat memposting!");
      navigate("/login");
    } else {
      document.getElementById("my_modal_2").showModal();
    }
  };
  return (
    <nav className="flex md:justify-between items-center gap-6 pb-2 border-b border-gray-300">
      <Link to={"/"} className="text-2xl font-bold">
        TO<span className="text-primary">GETHER.</span>
      </Link>
      <div
        className="md:hidden order-1 flex flex-col gap-2"
        onClick={() => onHamburgerHandler()}>
        <span className="block w-8 h-[3px] bg-black"></span>
        <span className="block w-8 h-[3px] bg-black"></span>
        <span className="block w-8 h-[3px] bg-black"></span>
      </div>
      <div
        id="item-nav"
        className={`md:relative md:py-0 py-4 absolute ${
          open ? "top-[10%]" : "-top-[100%]"
        } right-0 bg-white md:w-fit w-full flex md:flex-row flex-col gap-4 items-center font-medium transition-all duration-500 md:border-none border-b`}>
        <Link to={"/"} className="hover:underline hover:text-primary">
          Home
        </Link>
        <Link to={"/question"} className="hover:underline hover:text-primary">
          Diskusi
        </Link>
        <Link to={"/blogs"} className="hover:underline hover:text-primary">
          Blogs
        </Link>
        <Link to={"/contest"} className="hover:underline hover:text-primary">
          Kontes
        </Link>
      </div>

      {/* button posting */}
      <div className="md:ml-0 ml-auto flex">
        <button
          className="md:block hidden rounded-full px-6 py-2 border border-primary hover:text-white hover:bg-primary text-md text-primary font-semibold mr-4 transition-all"
          onClick={onPostHandler}>
          Posting sesuatu
        </button>
        <dialog id="my_modal_2" className="modal modal-middle">
          <div className="modal-box w-full mx-auto bg-gray-200">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">
              Silahkan memposting salah satu opsi dibawah ini.
            </h3>
            <div className="mt-8 flex items-center justify-center gap-2 w-full">
              <form
                method="dialog"
                className="w-full text-center text-md text-white font-semibold mr-4 transition-all">
                <button
                  onClick={() => navigateTo("/questions/add")}
                  className="w-full rounded-full px-6 py-2 bg-primary hover:border-white border-transparent border">
                  Pertanyaan
                </button>
              </form>
              <form
                method="dialog"
                className="w-full text-center text-primary hover:text-white text-md font-semibold mr-4 transition-all">
                <button
                  onClick={() => navigateTo("/blogs/add")}
                  className="w-full hover:bg-primary px-6 py-2  rounded-full border border-primary">
                  Blogs
                </button>
              </form>
            </div>
          </div>
        </dialog>
        <button
          onClick={buttonHandlerClick}
          className="rounded-full px-6 py-2 bg-primary text-md text-white font-semibold">
          {isLogin}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

Navbar.propTypes = {
  isLogin: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};
