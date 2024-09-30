import React, { useState, MouseEventHandler } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { RegisterType } from "@/types/auth";
import { useRouter } from "next/navigation";

interface Props {
  toggleCallback: MouseEventHandler<HTMLElement>;
}

const Register: React.FC<Props> = ({ toggleCallback }) => {
  const [registerRequest, setRegisterRequest] = useState<RegisterType>({
    email: "",
    name: "",
    phone_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = () => {
    setLoading(true);
    // TODO: validate register request
    register(registerRequest)
      .then((_) => {
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col p-20 rounded-xl bg-gray-100 items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <input
          className="input-field"
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="input-field"
          onChange={handleChange}
          type="text"
          name="name"
          placeholder="Full Name"
        />
        <input
          className="input-field"
          onChange={handleChange}
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
        />
        <input
          className="input-field"
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Password"
        />
      </div>
      <button className="btn w-full" onClick={handleRegister}>
        Sign up
      </button>
      <div>Or</div>
      <button className="btn w-full" onClick={toggleCallback}>
        Log in
      </button>
    </div>
  );
};

export default Register;
