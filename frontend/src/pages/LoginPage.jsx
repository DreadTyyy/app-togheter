import React, { useEffect } from "react";
import useInput from "../hooks/useInput";
import { login } from "../utils/network-data";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = ({ authUser, onLogin }) => {
  const navigate = useNavigate();
  const [email, onEmailChanges] = useInput();
  const [password, onPasswordChanges] = useInput();

  useEffect(() => {
    if (authUser !== null) {
      navigate("/");
    }
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const onLoginHandler = async () => {
      const { error, token } = await login({ email, password });
      if (!error) {
        alert("Login success");
        onLogin(token);
      }
    };

    onLoginHandler();
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center font-medium">
      <h1 className="text-xl font-bold">Login</h1>
      <form className="md:w-[40%] w-full text-white" onSubmit={onSubmitHandler}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            value={email}
            onChange={onEmailChanges}
            type="email"
            name="email"
            id="email"
            placeholder="Your email"
            className="input input-bordered w-full"
            required
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
            required
          />
        </label>
        <button className="mt-8 mb-4 hover:border-white border-transparent border rounded-full px-6 py-2 bg-primary text-md text-white font-semibold">
          Login
        </button>
      </form>
      <p className="text-sm text-gray-400 text-left md:w-[40%] w-full">
        Belum memiliki akun? Silahkan masuk ke laman{" "}
        <Link to={"/register"} className="text-primary underline">
          registrasi.
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
