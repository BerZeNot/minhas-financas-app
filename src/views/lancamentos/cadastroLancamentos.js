import React from "react";

import Card from '../../components/card';
import FormGroup from '../../components/form-group'
import SelectMenu from "../../components/selectMenu";

import { withRouter } from "react-router-dom";
import { errorMessage, successMessage } from "../../components/toastr";

import LacamentoService from "../../app/service/lancamentoService";
import localStorageService from "../../app/service/localStorageService";

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor() {
        super();
        this.service = new LacamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params
        if (params.id) {
            this.service
                .obterPorId(params.id)
                .then(response => {
                    this.setState({ ...response.data, atualizando: true })
                })
                .catch(error => {
                    errorMessage(error.response.data)
                })
        }

        console.log(params)
    }

    submit = () => {
        const usuarioLogado = localStorageService.getItem('_usuario_logado');

        const { descricao, valor, mes, ano, tipo } = this.state;
        const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id };

        try {
            this.service.validar(lancamento)
        } catch (error) {
            const mensagens = error.mensagens;
            mensagens.forEach(msg => errorMessage(msg))
            return false;
        }


        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                successMessage('Lançamento cadastrado com sucesso!')
            }).catch(error => {
                errorMessage(error.response.data)
            })
    }

    atualizar = () => {
        const { descricao, valor, mes, ano, tipo, status, usuario, id } = this.state;
        const lancamento = { descricao, valor, mes, ano, tipo, usuario, status, id };

        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                successMessage('Lançamento atualizado com sucesso!')
            }).catch(error => {
                errorMessage(error.response.data)
            })
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }

    render() {
        const tipos = this.service.obterListaTipos();
        const meses = this.service.obterListaMeses();

        return (
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descricao: *">
                            <input id="inputDescricao" type="text"
                                className="form-control"
                                name="descricao"
                                value={this.state.descricao}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" type="text"
                                className="form-control"
                                name="ano"
                                value={this.state.ano}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" lista={meses}
                                className="form-control"
                                name="mes"
                                value={this.state.mes}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" type="text"
                                className="form-control"
                                name="valor"
                                value={this.state.valor}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" lista={tipos}
                                className="form-control"
                                name="tipo"
                                value={this.state.tipo}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status: *">
                            <input type="text"
                                className="form-control"
                                name="status"
                                value={this.state.status}
                                disabled />
                        </FormGroup>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        {
                            this.state.atualizando
                                ? (<button onClick={this.atualizar} className="btn btn-success">
                                        <i className="pi pi-refresh"></i> Atualizar
                                   </button>)
                                : (<button onClick={this.submit} className="btn btn-success">
                                        <i className="pi pi-save"></i> Salvar
                                   </button>)
                        }
                        <button onClick={e => this.props.history.push('/consulta-lancamentos')}
                            className="btn btn-danger">
                                <i className="pi pi-times"></i> Cancelar
                            </button>
                    </div>
                </div>
            </Card >
        )
    }
}

export default withRouter(CadastroLancamentos);