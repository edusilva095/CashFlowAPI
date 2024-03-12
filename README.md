<h1>Cash Flow API</h1>
<p>Este projeto foi criado como parte de um processo seletivo da EBANX. Trata-se de uma API que simula um sistema bancário, permitindo a realização de depósitos, saques e transferências de dinheiro.</p>
<h2>Rotas</h2>
<Strong>1. POST /reset</strong>
<ul>
    <li>Reseta os dados do arquivo JSON</li>
</ul>
<strong>2. GET /balance/:account_id</strong>
<ul>
    <li>Retorna o saldo de uma conta</li>
</ul>
<strong>3. POST /event</strong>
<ul>
    <li>Cria uma conta com saldo inicial ou deposita em uma conta existente</li>
    <p></p>
    <p>POST /event {"type":"deposit", "destination":"100", "amount":10}</p>
</ul>
<ul>
    <li>Realiza saque de uma conta</li>
    <p></p>
    <p>POST /event {"type":"withdraw", "origin":"100", "amount":5}</p>
</ul>
<ul>
    <li>Realiza uma transferência</li>
    <p></p>
    <p>POST /event {"type":"transfer", "origin":"100", "amount":15, "destination":"300"}</p>
</ul>
