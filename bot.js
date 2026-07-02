// ============================================================
// BELEZA LINK — BOT DO TELEGRAM
// ============================================================
const TOKEN = '7595321463:AAErl-mLmEw6OM4ija8BC5eBsqN72Bt6C78';
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;

let lastUpdateId = 0;

const CURSOS = [
    { nome: '✨ Mechas Premium 2026',      preco: 'R$ 997',   link: 'https://go.hotmart.com/O106572652W?ap=6757' },
    { nome: '🎨 Colorimetria Avançada',     preco: 'R$ 797',   link: null },
    { nome: '✂️ Corte Feminino Atual',       preco: 'R$ 697',   link: null },
    { nome: '🔬 Tricologia Capilar',         preco: 'R$ 697',   link: null },
    { nome: '💇 Prótese Capilar',            preco: 'R$ 1.297', link: null },
    { nome: '💫 Mega Hair Completo',         preco: 'R$ 897',   link: null },
    { nome: '💆 Escova Progressiva',         preco: 'R$ 597',   link: null },
    { nome: '📅 Cronograma Capilar',         preco: 'R$ 497',   link: null },
    { nome: '📱 Marketing para Cabeleireiras', preco: 'R$ 597', link: null },
    { nome: '💼 Gestão de Salão',            preco: 'R$ 597',   link: null },
];

async function sendMessage(chatId, text, options = {}) {
    const body = { chat_id: chatId, text, parse_mode: 'HTML', ...options };
    await fetch(`${BASE_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

function handleMessage(msg) {
    const chatId = msg.chat.id;
    const text   = (msg.text || '').toLowerCase().trim();

    if (text === '/start' || text === 'oi' || text === 'olá' || text === 'ola') {
        sendMessage(chatId,
`💄 <b>Bem-vinda à Beleza Link!</b>

Somos a plataforma #1 em cursos profissionalizantes para cabeleireiras do Brasil.

Escolha uma opção abaixo:
📚 /cursos — Ver todos os cursos
🛒 /mechas — Comprar Mechas Premium (mais pedido!)
📞 /contato — Falar com atendente
❓ /faq — Dúvidas frequentes`
        );
        return;
    }

    if (text === '/cursos') {
        let lista = '📚 <b>Nossos Cursos:</b>\n\n';
        CURSOS.forEach((c, i) => {
            lista += `${i + 1}. ${c.nome} — <b>${c.preco}</b>\n`;
        });
        lista += '\n👉 Digite /mechas para comprar o curso #1 ou /contato para mais info!';
        sendMessage(chatId, lista);
        return;
    }

    if (text === '/mechas') {
        sendMessage(chatId,
`✨ <b>Mechas Premium 2026</b>

A especialização que gera o <b>maior ticket médio</b> nos salões!

🎯 O que você vai aprender:
• Balayage & Babylights
• AirTouch
• Morena Iluminada
• Correção de Cor Avançada

💰 Investimento: <b>R$ 997</b> ou 12x de R$ 97
🛡️ Garantia incondicional de 7 dias

👇 <a href="https://go.hotmart.com/O106572652W?ap=6757">CLIQUE AQUI PARA COMPRAR AGORA</a>`
        );
        return;
    }

    if (text === '/contato') {
        sendMessage(chatId,
`📞 <b>Fale com a Beleza Link!</b>

📱 WhatsApp: <a href="https://wa.me/5562992115143">+55 (62) 99211-5143</a>
🌐 Site: http://localhost:3000

Nosso atendimento é de segunda a sábado, das 8h às 18h.`
        );
        return;
    }

    if (text === '/faq') {
        sendMessage(chatId,
`❓ <b>Perguntas Frequentes</b>

🏆 <b>Os cursos têm certificado?</b>
Sim! Certificado válido em todo o Brasil.

⏱️ <b>Por quanto tempo tenho acesso?</b>
Acesso vitalício — para sempre!

🆕 <b>Preciso ter experiência?</b>
Não! Temos cursos para todos os níveis.

🛡️ <b>E a garantia?</b>
7 dias. Se não gostar, devolvemos 100%.

📚 Para ver todos os cursos: /cursos`
        );
        return;
    }

    // Resposta padrão
    sendMessage(chatId,
`Olá! 😊 Não entendi sua mensagem.

Use um dos comandos abaixo:
📚 /cursos — Ver nossos cursos
🛒 /mechas — Comprar Mechas Premium
📞 /contato — Falar conosco
❓ /faq — Dúvidas frequentes`
    );
}

async function getUpdates() {
    try {
        const res  = await fetch(`${BASE_URL}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
        const data = await res.json();
        if (data.ok && data.result.length > 0) {
            for (const update of data.result) {
                lastUpdateId = update.update_id;
                if (update.message) handleMessage(update.message);
            }
        }
    } catch (e) {
        console.error('Erro ao buscar atualizações:', e.message);
    }
    setTimeout(getUpdates, 1000);
}

console.log('🤖 Bot da Beleza Link iniciado! Aguardando mensagens...');
getUpdates();
