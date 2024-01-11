import React, { useEffect } from "react";
import useInput from "../hooks/useInput";
import { register } from "../utils/network-data";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = ({ authUser }) => {
  const navigate = useNavigate();
  const [username, onUsernameChanges] = useInput();
  const [email, onEmailChanges] = useInput();
  const [password, onPasswordChanges] = useInput();
  const [password2, onPassword2Changes] = useInput();

  useEffect(() => {
    if (authUser !== null) {
      navigate("/");
    }
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (password !== password2) {
      return alert("Password yang anda masukkan tidak cocok!");
    }
    const onRegister = async () => {
      const response = await register({ username, email, password });
      if (!response.error) {
        navigate("/login");
      }
    };
    onRegister();
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center font-medium">
      <h1 className="text-xl font-bold">Registrasi Akun</h1>
      <form className="md:w-[40%] w-full text-white" onSubmit={onSubmitHandler}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <input
            type="text"
            value={username}
            onChange={onUsernameChanges}
            name="username"
            id="username"
            placeholder="Your username"
            className="input input-bordered w-full"
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            type="email"
            value={email}
            onChange={onEmailChanges}
            name="email"
            id="email"
            placeholder="Your email"
            className="input input-bordered w-full"
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            type="password"
            value={password}
            onChange={onPasswordChanges}
            name="password"
            id="password"
            placeholder="Your password"
            className="input input-bordered w-full"
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Confirm Password</span>
          </div>
          <input
            type="password"
            value={password2}
            onChange={onPassword2Changes}
            name="password2"
            id="password2"
            placeholder="Your password"
            className="input input-bordered w-full"
          />
        </label>
        <button className="mt-8 mb-4 hover:border-white border-transparent border rounded-full px-6 py-2 bg-primary text-md text-white font-semibold">
          Register
        </button>
      </form>
      <p className="text-sm  text-gray-400 text-left md:w-[40%] w-full">
        Sudah memiliki akun? Silahkan masuk ke laman{" "}
        <Link to={"/login"} className="text-primary underline">
          login
        </Link>
        .
      </p>
    </div>
  );
};

export default RegisterPage;
