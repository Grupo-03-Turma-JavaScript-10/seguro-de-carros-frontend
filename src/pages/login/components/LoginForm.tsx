import { useState } from "react";
import { login } from "../../../services/Service";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, senha);
      localStorage.setItem("token", response.data.access_token);
      // Redirecione o usuário ou atualize o estado global de autenticação aqui
      setError("");
      alert("Login realizado com sucesso!");
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
      </div>
      <button type="submit">Entrar</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
