import axios from "axios";

const URL_BACKEND = "https://seguro-de-carros-backend.onrender.com"
// local -> http://localhost:4000
// produção -> https://seguro-de-carros-backend.onrender.com

const api = axios.create({
	baseURL: URL_BACKEND
});

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { ts: number; data: any }>();

// Retry automático para Network Errors
async function withRetry(fn: () => Promise<any>, maxRetries = 3) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error: any) {
			// Se for erro de rede e não é a última tentativa, espera e tenta de novo
			if (error.code === 'ERR_NETWORK' && i < maxRetries - 1) {
				console.log(`Retry ${i + 1}/${maxRetries - 1} após 2s...`);
				await new Promise(resolve => setTimeout(resolve, 2000));
				continue;
			}
			throw error;
		}
	}
}

async function getCached(key: string, fetcher: () => Promise<any>) {
	const cached = cache.get(key);
	const now = Date.now();
	if (cached && now - cached.ts < CACHE_TTL_MS) {
		return cached.data;
	}
	const data = await fetcher();
	cache.set(key, { ts: now, data });
	return data;
}

function clearCache(keys: string[]) {
	keys.forEach((key) => cache.delete(key));
}

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

export const getMe = () => api.get("/clientes/me");

// Clientes (protegidas)
export const getClientes = () => api.get("/clientes/all");
export const getClienteById = (id: number) => api.get(`/clientes/${id}`);

// Veículos
export const getVeiculos = () => getCached("veiculos", () => api.get("/veiculos"));
export const getMeusVeiculos = async () => {
	const userId = localStorage.getItem("userId");
	const res = await getVeiculos();
	return {
		...res,
		data: (res.data || []).filter((v: any) => v.cliente?.id === Number(userId))
	};
};
export const getVeiculoById = (id: number) => api.get(`/veiculos/${id}`);
export const createVeiculo = async (data: any) => {
	const res = await withRetry(() => api.post("/veiculos", data));
	clearCache(["veiculos"]);
	return res;
};
export const updateVeiculo = async (id: number, data: any) => {
	const res = await withRetry(() => api.put(`/veiculos/${id}`, data));
	clearCache(["veiculos"]);
	return res;
};
export const deleteVeiculo = async (id: number) => {
	const res = await withRetry(() => api.delete(`/veiculos/${id}`));
	clearCache(["veiculos"]);
	return res;
};

// Apólices
export const getApolices = () => getCached("apolices", () => api.get("/apolice"));
export const getApoliceById = (id: number) => api.get(`/apolice/${id}`);
export const getApoliceByNumero = (numero: string) => api.get(`/apolice/numero/${numero}`);
export const createApolice = async (data: any) => {
	const res = await withRetry(() => api.post("/apolice", data));
	clearCache(["apolices"]);
	return res;
};
export const updateApolice = async (id: number, data: any) => {
	const res = await withRetry(() => api.put(`/apolice/${id}`, data));
	clearCache(["apolices"]);
	return res;
};
export const deleteApolice = async (id: number) => {
	const res = await withRetry(() => api.delete(`/apolice/${id}`));
	clearCache(["apolices"]);
	return res;
};

// Preload dados em background após login
export const preloadUserData = async () => {
	try {
		await Promise.all([
			getApolices().catch(() => {}),
			getMeusVeiculos().catch(() => {})
		]);
	} catch (error) {
		// Silenciosamente falha - é só preload
		console.log("Preload em background completado");
	}
};

export default api;
