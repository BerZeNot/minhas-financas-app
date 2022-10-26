import React from "react";

import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'

import Login from "../views/login";
import CadastroUsuario from "../views/cadastroUsuario";
import Home from "../views/home";
import ConsultaLancamentos from "../views/lancamentos/consultaLancamentos";
import CadastroLancamentos from "../views/lancamentos/cadastroLancamentos";
import LandingPage from "../views/landingPage";

import { AuthConsumer } from "./provedorAutenticacao";
function RotaAutenticada({ component: Component, isUsuarioAutenticado, ...props }) {
    return (
        <Route exact {...props} render={(componentProps) => {
            if (isUsuarioAutenticado) {
                return (
                    <Component {...componentProps} />
                )
            } else {
                return (
                    <Redirect to={{ pathname: '/login', state: { from: componentProps.location } }} />
                )
            }
        }} />
    )
}

function Rotas(props) {

    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/cadastro-usuarios" component={CadastroUsuario} />

                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/consulta-lancamentos" component={ConsultaLancamentos} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/cadastro-lancamentos/:id?" component={CadastroLancamentos} />
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        {(context) => (<Rotas isUsuarioAutenticado={context.isAutenticado} />)}
    </AuthConsumer>
);