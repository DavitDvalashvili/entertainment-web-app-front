import FormPageStyle from "../components/styledComponents/FormPageStyle";
import Logo from "../assets/logo.svg";
import { SignUpInputs } from "../Types";
import { useNavigate, Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const SignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // display error message on the screen
  const handleError = (message: string | undefined) => {
    toast.error(message, {
      position: "bottom-left",
      autoClose: 1000,
    });
  };

  //display success message on the screen
  const handleSuccess = (message: string) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 1000,
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const navigate = useNavigate();
  //send post request to register user
  const submitFunction: SubmitHandler<SignUpInputs> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/signUp`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //displays message ;
      if (response.data.success) {
        // Sign-up successful
        handleSuccess(response.data.message);
        //after 1 second navigate to login page
        setTimeout(() => {
          navigate("/signIn");
          setLoading(false);
        }, 1000);
      } else {
        // Sign-up failed
        handleError(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Sign-up failed", error);
      handleError("Sign-up failed, server error");
      setLoading(false);
    }
  };

  //check if repeated password matches the password
  const validatePasswordRepeat = () => {
    const password = watch("password");
    const repeatPassword = watch("repeatPassword");
    if (password === repeatPassword) {
      return undefined;
    } else {
      return "Don't match";
    }
  };

  return (
    <FormPageStyle>
      <img src={Logo} className="logo" alt="logo" />
      <div className="container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit(submitFunction)}>
          <div className={errors.email ? "email errorEmail" : "email"}>
            <input
              type="text"
              placeholder="Email address"
              {...register("email", {
                required: "Can’t be empty",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && <span>{errors.email?.message}</span>}
          </div>
          <div
            className={errors.password ? "password errorPassword" : "password"}
          >
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Can’t be empty",
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d.,!@#$%^&*()_+{}[\]:;<>,.?/~\\-]{5,}$/,
                  message: "It's too weak",
                },
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <div
            className={
              errors.repeatPassword
                ? "repeatPassword errorRepeatPassword"
                : "repeatPassword"
            }
          >
            <input
              type="password"
              placeholder="Repeat Password"
              {...register("repeatPassword", {
                required: "Can’t be empty",
                validate: validatePasswordRepeat,
              })}
            />
            {errors.repeatPassword && (
              <span>{errors.repeatPassword.message}</span>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Create an account"}
          </button>
        </form>
        <p>
          Already have an account? <Link to={"/signIn"}>Sign In</Link>
        </p>
      </div>
      <ToastContainer />
    </FormPageStyle>
  );
};

export default SignUp;
