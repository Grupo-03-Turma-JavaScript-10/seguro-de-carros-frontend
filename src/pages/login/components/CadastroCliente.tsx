import { useState } from "react";
import { register } from "../../../services/Service";
export function CadastroCliente() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", cpf: "", telefone: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cpf: form.cpf,
        telefone: form.telefone
      });
      await register(form.nome, form.email, form.senha, form.cpf, form.telefone);
      setSuccess(true);
      setError("");
    } catch (err) {
      setSuccess(false);
      setError("Erro ao cadastrar cliente");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Cadastro de Cliente</h2>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          name="senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>CPF:</label>
        <input
          type="text"
          name="cpf"
          value={form.cpf}
          onChange={handleChange}
          required
          maxLength={14}
        />
      </div>
      <div>
        <label>Telefone:</label>
        <input
          type="text"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Cadastrar</button>
      {success && <div style={{ color: "green" }}>Cadastro realizado!</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
