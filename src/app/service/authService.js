import localStorageService from "./localStorageService";

export const USUARIO_LOGADO = '_usuario_logado'

export default class AuthService {

    static isUsuarioAutenticado() {
        const usuario = localStorageService.getItem(USUARIO_LOGADO);
        return usuario && usuario.id;
    }

    static removerUsuarioAutenticado(){
        localStorageService.removeItem(USUARIO_LOGADO);
    }

    static logar(usuario) {
        localStorageService.addItem(USUARIO_LOGADO, usuario);
    }

    static getAuthenticatedUser() {
        return localStorageService.getItem(USUARIO_LOGADO);
    }
}