import localStorageService from "./localStorageService";
import ApiService from "../apiService";
import jwt_decode from 'jwt-decode';

export const USUARIO_LOGADO = '_usuario_logado'
export const TOKEN = '_access_token'

export default class AuthService {

    static isUsuarioAutenticado() {
        const token = localStorageService.getItem(TOKEN)
        if(token == null)
            return false
            
        const decodedToken = jwt_decode(token)
        const expiration = decodedToken.exp;
        const isTokenInvalido = Date.now() >= (expiration * 1000)
        return !isTokenInvalido;
    }

    static removerUsuarioAutenticado(){
        localStorageService.removeItem(USUARIO_LOGADO);
        localStorageService.removeItem(TOKEN);
    }

    static logar(usuario, token) {
        localStorageService.addItem(USUARIO_LOGADO, usuario);
        localStorageService.addItem(TOKEN, token);
        ApiService.registrarToken(token);
    }

    static getAuthenticatedUser() {
        return localStorageService.getItem(USUARIO_LOGADO);
    }

    static refreshSession(){
        const token = localStorageService.getItem(TOKEN)
        const usuario = AuthService.getAuthenticatedUser()
        AuthService.logar(usuario, token)
        return usuario
    }
}