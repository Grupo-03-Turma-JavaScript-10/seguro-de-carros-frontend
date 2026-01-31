import axios from "axios";

const api = axios.create({
	baseURL: "https://seguro-de-carros-backend.onrender.com", // Adicione a URL do seu backend Render aqui
});

// Adiciona o token JWT automaticamente se existir
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});


// Auth
export const login = (email: string, senha: string) =>
	api.post("/clientes/logar", { email, senha });

export const register = (nome: string, email: string, senha: string, cpf: string, telefone: string) =>
	api.post("/clientes/cadastrar", { nome, email, senha, cpf, telefone });

// Clientes (protegidas)
export const getClientes = () => api.get("/clientes/all");
export const getClienteById = (id: number) => api.get(`/clientes/${id}`);

// Veículos
export const getVeiculos = () => api.get("/veiculo");
export const getVeiculoById = (id: number) => api.get(`/veiculo/${id}`);
export const createVeiculo = (data: any) => api.post("/veiculo", data);

// Apólices
export const getApolices = () => api.get("/apolice");
export const getApoliceById = (id: number) => api.get(`/apolice/${id}`);
export const getApoliceByNumero = (numero: string) => api.get(`/apolice/numero/${numero}`);
export const createApolice = (data: any) => api.post("/apolice", data);
export const updateApolice = (id: number, data: any) => api.put(`/apolice/${id}`, data);
export const deleteApolice = (id: number) => api.delete(`/apolice/${id}`);

export default api;
