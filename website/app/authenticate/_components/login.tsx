import React, { useState, MouseEventHandler, } from "react";
import type { LoginType } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth";
import { redirect, useRouter } from "next/navigation";

interface Props {
  toggleCallback: MouseEventHandler<HTMLElement>
}

const Login: React.FC<Props> = ({
  toggleCallback,
}) => {
  const [loginRequest, setLoginRequest] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const router = useRouter()
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginRequest(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  };

  const handleLogin = () => {
    setLoading(true);
    login(loginRequest)
      .then(_ => {
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col p-20 rounded-xl bg-gray-100 items-center gap-4">
      <div>
        <span className="text-4xl font-bold"></span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <input className="input-field" onChange={handleChange} type="email" name="email" placeholder="Email" />
        <input className="input-field" onChange={handleChange} type="password" name="password" placeholder="Password"/>
      </div>
      <button className="btn w-full" onClick={handleLogin}>Log in</button>
      <div>Or</div>
      <button className="btn w-full" onClick={toggleCallback}>Sign up</button>
    </div>
  )
}

export default Login;
