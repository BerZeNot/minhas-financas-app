import React from "react";
import UsuarioService from "../app/service/usuarioService";
import currencyFormatter from "currency-formatter"
import { AuthContext } from "../main/provedorAutenticacao";

class Home extends React.Component {

    state = {
        saldo: 0
    }

    constructor() {
        super()
        this.usuarioService = new UsuarioService();
    }

    componentDidMount() {
        const usuarioLogado = this.context.usuarioAutenticado;

        this.usuarioService
            .obterSaldoPorUsuario(usuarioLogado.id)
            .then(response => {
                this.setState({ saldo: response.data })
            }).catch(error => {
                console.log(error.response)
            })
    }

    cadastrarUsuario = () => {
        this.props.history.push('/home')
    }

    render() {
        return (
            <div className="jumbotron">
                <h1 className="display-3">Bem vindo!</h1>
                <p className="lead">Esse é seu sistema de finanças.</p>
                <p className="lead">
                    Seu saldo para o mês atual é de {currencyFormatter.format(this.state.saldo, { locale: 'pt-BR' })}
                </p>
                <hr className="my-4" />
                <p>E essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema</p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg"
                        href="#/cadastro-usuarios"
                        role="button"><i className="pi pi-users"></i> 
                            &nbsp;Cadastrar Usuário
                    </a>
                    <a className="btn btn-danger btn-lg"
                        href="#/cadastro-lancamentos"
                        role="button"><i className="pi pi-money-bill"></i>
                            &nbsp;Cadastrar Lançamento
                    </a>
                </p>
            </div>
        )
    }
}

Home.contextType = AuthContext;

export default Home;