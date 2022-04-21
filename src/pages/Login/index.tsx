import React, { useContext, useRef } from "react";
import { Form } from "@unform/web";
import { FormHandles, SubmitHandler } from "@unform/core";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Background, Content } from "./style";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Line from "../../components/Line";
import Logo from "../../components/Logo";
import getValidationsErrors from "../../utils/getValidationErrors";
import { api } from "../../services/api";
import { AuthLoadingContext } from "../../context/authAndLoading";
import Loader from "../../components/Loader";

function Login() {
  const formRef = useRef<FormHandles>(null);
  const { getData, loading } = useContext(AuthLoadingContext);
  const navigate = useNavigate();

  const handleFormSubmit: SubmitHandler = async (data) => {
    try {
      const schema = yup.object().shape({
        email: yup.string().email("Digite um email válido").required("Email é obrigatório"),
        password: yup.string().min(6, "Senha mínimo 6 caracteres").required("Senha é obrigatória!"),
      });

      await schema.validate(data, { abortEarly: false });

      formRef.current?.setErrors({});

      await api.post("/user/login", data, { withCredentials: true });
      await getData();

      return navigate("/");
    } catch (error) {
      console.log(error);
      if (error instanceof yup.ValidationError) {
        const errors = getValidationsErrors(error);
        return formRef.current?.setErrors(errors);
      }
      const err = error as AxiosError;
      if (err.response?.data === "Email or password is incorrect") {
        return formRef.current?.setErrors({ email: "Email ou senha está incorreto" });
      }
      return toast.error("Ocorreu um erro, tente novamente!", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div>
      {!loading ? (
        <Container>
          <ToastContainer />
          <Content>
            <Line>
              <Logo />
            </Line>
            <Form ref={formRef} onSubmit={handleFormSubmit}>
              <h1>Faça seu login</h1>
              <Input name="email" placeholder="E-mail" Icon={FiMail} />
              <Input name="password" type="password" placeholder="Senha" Icon={FiLock} />
              <Button type="submit">Entrar</Button>
            </Form>
            <Link to="/register">
              <FiLogIn />
              Criar conta
            </Link>
          </Content>
          <Background />
        </Container>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default Login;
