import React from 'react';
import { withRouter } from 'react-router-dom';

import Card from '../../components/card';
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu';
import LancamentosTable from './lancamentosTable';
import LancamentosService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        lancamentos: [],
        lancamentoADeletar: {},
        showConfirmDialog: false,
    }

    constructor() {
        super();
        this.service = new LancamentosService();
    }

    buscar = () => {
        if (!this.state.ano) {
            messages.errorMessage("O preenchimento do campo ano é obrigatório.")
            return false;
        }

        const usuarioLogado = LocalStorageService.getItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then(response => {
                const lista = response.data;
                if(lista.length < 1){
                    messages.warningMessage("Nenhum resultado encontrado.")
                }
                this.setState({ lancamentos: response.data })
            }).catch(error => {
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoADeletar: lancamento })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, lancamentoADeletar: {} })
    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoADeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoADeletar);
                lancamentos.splice(index, 1);
                this.setState({ lancamentos: lancamentos, showConfirmDialog: false })
                messages.successMessage('Lançamento deletado com sucesso!')

            }).catch(error => {
                messages.errorMessage('Ocorreu um erro ao deletar o Lançamento.')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    alterarStatus = (lancamento, status) => {
        this.service
        .alterarStatus(lancamento.id, status)
        .then( response => {
            const lancamentos = this.state.lancamentos;
            const index = lancamentos.indexOf(lancamento);
            if(index !== -1){
                lancamento['status'] = status;
                lancamentos[index] = lancamento
                this.setState(lancamentos);
            }

            messages.successMessage("Status atualizado com sucesso!")
        })
    }

    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar}
                    className="p-button-danger" />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao}
                    className="p-button-secondary" />
            </div>
        );

        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup hmtlFor="inputAno" label="Ano: *">
                                <input type="text"
                                    className="form-control"
                                    id="inputAno"
                                    value={this.state.ano}
                                    onChange={e => this.setState({ ano: e.target.value })}
                                    placeholder="Digite o ano"
                                />
                            </FormGroup>
                            <br />
                            <FormGroup hmtlFor="inputMes" label="Mês: ">
                                <SelectMenu id="inputMes"
                                    value={this.state.mes}
                                    onChange={e => this.setState({ mes: e.target.value })}
                                    className="form-control"
                                    lista={meses}
                                />
                            </FormGroup>
                            <br />
                            <FormGroup hmtlFor="inputDesc" label="Descrição">
                                <input type="text"
                                    className="form-control"
                                    id="inputDesc"
                                    value={this.state.descricao}
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                    placeholder="Digite a descrição"
                                />
                            </FormGroup>
                            <br />
                            <FormGroup hmtlFor="inputTipo" label="Tipo de Lançamento: ">
                                <SelectMenu id="inputTipo"
                                    className="form-control"
                                    lista={tipos}
                                    value={this.state.tipo}
                                    onChange={e => this.setState({ tipo: e.target.value })}
                                />
                            </FormGroup>
                            <br />
                            <button onClick={this.buscar} type="button" className="btn btn-success">
                                <i className="pi pi-search"></i> Buscar
                            </button>
                            <button onClick={this.preparaFormularioCadastro} type="button" className="btn btn-danger">
                            <i className="pi pi-plus"></i> Cadastrar
                            </button>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos}
                                deleteAction={this.abrirConfirmacao}
                                editAction={this.editar}
                                alterarStatus={this.alterarStatus}/>
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog
                        header="Confirmação"
                        visible={this.state.showConfirmDialog}
                        style={{ width: '50vw' }}
                        footer={confirmDialogFooter}
                        modal={true}
                        onHide={() => this.setState({ showConfirmDialog: false })}>
                        <p>Deseja excluir o lançamento?</p>
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos);