// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const walletAddressElement = document.getElementById('wallet-address');
const walletBalanceElement = document.getElementById('wallet-balance');
const tpsIndicatorElement = document.getElementById('tps-indicator');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const themeToggle = document.getElementById('theme-toggle');
const refreshBtn = document.getElementById('refresh-btn');
const fullWalletAddressElement = document.getElementById('full-wallet-address');
const creditsList = document.getElementById('credits-list');
const totalTokenValueElement = document.getElementById('total-token-value');
const refreshCreditsBtn = document.getElementById('refresh-credits-btn');
const sendTokenBtn = document.getElementById('send-token-btn');
const receiveTokenBtn = document.getElementById('receive-token-btn');
const swapTokenBtn = document.getElementById('swap-token-btn');
const sendTokenModal = document.getElementById('send-token-modal');
const receiveTokenModal = document.getElementById('receive-token-modal');
const confirmSendBtn = document.getElementById('confirm-send-btn');
const copyAddressBtn = document.getElementById('copy-address-btn');
const tokenSelect = document.getElementById('token-select');
const recipientAddress = document.getElementById('recipient-address');
const tokenAmount = document.getElementById('token-amount');

// MCP Server URL (adjust as needed)
const MCP_SERVER_URL = 'http://localhost:3000/mcp';

// Global variables
let walletAddress = '';
let credits = [];
let currentTheme = 'dark';
let availableCredits = 100; // Valor inicial de créditos
let creditCostPerMessage = 1; // Custo por mensagem
let marketRefreshInterval;

// Variáveis globais para o gráfico
let priceChart = null;
let currentChartSymbol = '';
let currentTimeframe = '1d';
let candleChart = null;
let candleSeries = null;
let volumeSeries = null;
let chartData = {};
let tvWidget = null;

// Objeto com traduções
const translations = {
    en: {
        // Chat section
        "welcome_title": "Welcome to Oblivion On Chain!",
        "welcome_description": "This futuristic interface allows you to interact with the Solana blockchain through simple commands.",
        "welcome_tip": "Try using the quick action buttons below or type a command directly.",
        "available_credits": "Available Credits",
        "buy_credits": "Buy Credits",
        "view_wallet": "View Wallet",
        "check_balance": "Check Balance",
        "list_tokens": "List Tokens",
        "network_tps": "Network TPS",
        "check_price": "Check Price",
        "type_command": "Type a command or message...",
        
        // Credits section
        "chat_credits": "Chat Credits",
        "credits_info_1": "Credits are used to send messages in the chat.",
        "credits_info_2": "Each message costs 1 credit.",
        "purchase_credits": "Purchase Credits",
        "transaction_history": "Transaction History",
        "date": "Date",
        "type": "Type",
        "amount": "Amount",
        "balance": "Balance",
        
        // Market section
        "market_overview": "Market Overview",
        "search_tokens": "Search tokens...",
        "token": "Token",
        "price": "Price",
        "change_24h": "24h Change",
        "volume_24h": "24h Volume",
        "actions": "Actions",
        "chart": "Chart",
        "buy": "Buy",
        
        // Settings section
        "settings": "Settings",
        "save": "Save",
        "language": "Language",
        "interface_language": "Interface Language",
        "data_refresh": "Data Refresh",
        "auto_refresh": "Auto Refresh Market Data",
        "refresh_interval": "Refresh Interval (seconds)",
        "notifications": "Notifications",
        "enable_notifications": "Enable Notifications",
        "security": "Security",
        "hide_balances": "Hide Balances",
        "transaction_limit": "Transaction Limit (SOL)",
        "credits": "Credits",
        "credit_cost": "Credit Cost Per Message",
        "about": "About",
        "version": "Version",
        "description": "A futuristic interface for interacting with the Solana blockchain",
        
        // Messages
        "settings_saved": "Settings saved successfully",
        "language_changed": "Language changed to English",
        "not_enough_credits": "You do not have enough credits to send a message. Please purchase more credits.",
        "address_copied": "Address copied to clipboard!",
        "payment_successful": "Payment successful! {0} credits added to your account."
    },
    pt: {
        // Chat section
        "welcome_title": "Bem-vindo ao Oblivion On Chain!",
        "welcome_description": "Esta interface futurista permite que você interaja com a blockchain Solana através de comandos simples.",
        "welcome_tip": "Experimente usar os botões de ação rápida abaixo ou digite um comando diretamente.",
        "available_credits": "Créditos Disponíveis",
        "buy_credits": "Comprar Créditos",
        "view_wallet": "Ver Carteira",
        "check_balance": "Verificar Saldo",
        "list_tokens": "Listar Tokens",
        "network_tps": "TPS da Rede",
        "check_price": "Verificar Preço",
        "type_command": "Digite um comando ou mensagem...",
        
        // Credits section
        "chat_credits": "Créditos de Chat",
        "credits_info_1": "Os créditos são usados para enviar mensagens no chat.",
        "credits_info_2": "Cada mensagem custa 1 crédito.",
        "purchase_credits": "Comprar Créditos",
        "transaction_history": "Histórico de Transações",
        "date": "Data",
        "type": "Tipo",
        "amount": "Quantidade",
        "balance": "Saldo",
        
        // Market section
        "market_overview": "Visão Geral do Mercado",
        "search_tokens": "Buscar tokens...",
        "token": "Token",
        "price": "Preço",
        "change_24h": "Variação 24h",
        "volume_24h": "Volume 24h",
        "actions": "Ações",
        "chart": "Gráfico",
        "buy": "Comprar",
        
        // Settings section
        "settings": "Configurações",
        "save": "Salvar",
        "language": "Idioma",
        "interface_language": "Idioma da Interface",
        "data_refresh": "Atualização de Dados",
        "auto_refresh": "Atualização Automática de Dados",
        "refresh_interval": "Intervalo de Atualização (segundos)",
        "notifications": "Notificações",
        "enable_notifications": "Ativar Notificações",
        "security": "Segurança",
        "hide_balances": "Ocultar Saldos",
        "transaction_limit": "Limite de Transação (SOL)",
        "credits": "Créditos",
        "credit_cost": "Custo de Crédito Por Mensagem",
        "about": "Sobre",
        "version": "Versão",
        "description": "Uma interface futurista para interagir com a blockchain Solana",
        
        // Messages
        "settings_saved": "Configurações salvas com sucesso",
        "language_changed": "Idioma alterado para Português",
        "not_enough_credits": "Você não tem créditos suficientes para enviar uma mensagem. Por favor, compre mais créditos.",
        "address_copied": "Endereço copiado para a área de transferência!",
        "payment_successful": "Pagamento bem-sucedido! {0} créditos adicionados à sua conta."
    },
    es: {
        // Chat section
        "welcome_title": "¡Bienvenido a Oblivion On Chain!",
        "welcome_description": "Esta interfaz futurista te permite interactuar con la blockchain de Solana a través de comandos simples.",
        "welcome_tip": "Prueba usar los botones de acción rápida a continuación o escribe un comando directamente.",
        "available_credits": "Créditos Disponibles",
        "buy_credits": "Comprar Créditos",
        "view_wallet": "Ver Billetera",
        "check_balance": "Verificar Saldo",
        "list_tokens": "Listar Tokens",
        "network_tps": "TPS de la Red",
        "check_price": "Verificar Precio",
        "type_command": "Escribe un comando o mensaje...",
        
        // Credits section
        "chat_credits": "Créditos de Chat",
        "credits_info_1": "Los créditos se utilizan para enviar mensajes en el chat.",
        "credits_info_2": "Cada mensaje cuesta 1 crédito.",
        "purchase_credits": "Comprar Créditos",
        "transaction_history": "Historial de Transacciones",
        "date": "Fecha",
        "type": "Tipo",
        "amount": "Cantidad",
        "balance": "Saldo",
        
        // Market section
        "market_overview": "Visión General del Mercado",
        "search_tokens": "Buscar tokens...",
        "token": "Token",
        "price": "Precio",
        "change_24h": "Cambio 24h",
        "volume_24h": "Volumen 24h",
        "actions": "Acciones",
        "chart": "Gráfico",
        "buy": "Comprar",
        
        // Settings section
        "settings": "Configuración",
        "save": "Guardar",
        "language": "Idioma",
        "interface_language": "Idioma de la Interfaz",
        "data_refresh": "Actualización de Datos",
        "auto_refresh": "Actualización Automática de Datos",
        "refresh_interval": "Intervalo de Actualización (segundos)",
        "notifications": "Notificaciones",
        "enable_notifications": "Activar Notificaciones",
        "security": "Seguridad",
        "hide_balances": "Ocultar Saldos",
        "transaction_limit": "Límite de Transacción (SOL)",
        "credits": "Créditos",
        "credit_cost": "Costo de Crédito Por Mensaje",
        "about": "Acerca de",
        "version": "Versión",
        "description": "Una interfaz futurista para interactuar con la blockchain de Solana",
        
        // Messages
        "settings_saved": "Configuración guardada con éxito",
        "language_changed": "Idioma cambiado a Español",
        "not_enough_credits": "No tienes suficientes créditos para enviar un mensaje. Por favor, compra más créditos.",
        "address_copied": "¡Dirección copiada al portapapeles!",
        "payment_successful": "¡Pago exitoso! {0} créditos añadidos a tu cuenta."
    },
    th: {
        // Chat section
        "welcome_title": "ยินดีต้อนรับสู่ Oblivion On Chain!",
        "welcome_description": "อินเทอร์เฟซล้ำสมัยนี้ช่วยให้คุณโต้ตอบกับบล็อกเชน Solana ผ่านคำสั่งง่ายๆ",
        "welcome_tip": "ลองใช้ปุ่มการดำเนินการด่วนด้านล่างหรือพิมพ์คำสั่งโดยตรง",
        "available_credits": "เครดิตที่มี",
        "buy_credits": "ซื้อเครดิต",
        "view_wallet": "ดูกระเป๋าเงิน",
        "check_balance": "ตรวจสอบยอดคงเหลือ",
        "list_tokens": "รายการโทเค็น",
        "network_tps": "TPS เครือข่าย",
        "check_price": "ตรวจสอบราคา",
        "type_command": "พิมพ์คำสั่งหรือข้อความ...",
        
        // Credits section
        "chat_credits": "เครดิตแชท",
        "credits_info_1": "เครดิตใช้สำหรับส่งข้อความในแชท",
        "credits_info_2": "แต่ละข้อความใช้เครดิต 1 เครดิต",
        "purchase_credits": "ซื้อเครดิต",
        "transaction_history": "ประวัติการทำธุรกรรม",
        "date": "วันที่",
        "type": "ประเภท",
        "amount": "จำนวน",
        "balance": "ยอดคงเหลือ",
        
        // Market section
        "market_overview": "ภาพรวมตลาด",
        "search_tokens": "ค้นหาโทเค็น...",
        "token": "โทเค็น",
        "price": "ราคา",
        "change_24h": "เปลี่ยนแปลง 24 ชม.",
        "volume_24h": "ปริมาณ 24 ชม.",
        "actions": "การดำเนินการ",
        "chart": "แผนภูมิ",
        "buy": "ซื้อ",
        
        // Settings section
        "settings": "การตั้งค่า",
        "save": "บันทึก",
        "language": "ภาษา",
        "interface_language": "ภาษาอินเทอร์เฟซ",
        "data_refresh": "รีเฟรชข้อมูล",
        "auto_refresh": "รีเฟรชข้อมูลตลาดอัตโนมัติ",
        "refresh_interval": "ช่วงเวลารีเฟรช (วินาที)",
        "notifications": "การแจ้งเตือน",
        "enable_notifications": "เปิดใช้งานการแจ้งเตือน",
        "security": "ความปลอดภัย",
        "hide_balances": "ซ่อนยอดคงเหลือ",
        "transaction_limit": "ขีดจำกัดการทำธุรกรรม (SOL)",
        "credits": "เครดิต",
        "credit_cost": "ต้นทุนเครดิตต่อข้อความ",
        "about": "เกี่ยวกับ",
        "version": "เวอร์ชัน",
        "description": "อินเทอร์เฟซล้ำสมัยสำหรับการโต้ตอบกับบล็อกเชน Solana",
        
        // Messages
        "settings_saved": "บันทึกการตั้งค่าเรียบร้อยแล้ว",
        "language_changed": "เปลี่ยนภาษาเป็นภาษาไทย",
        "not_enough_credits": "คุณมีเครดิตไม่เพียงพอที่จะส่งข้อความ โปรดซื้อเครดิตเพิ่มเติม",
        "address_copied": "คัดลอกที่อยู่ไปยังคลิปบอร์ดแล้ว!",
        "payment_successful": "ชำระเงินสำเร็จ! เพิ่ม {0} เครดิตในบัญชีของคุณแล้ว"
    }
};

// Idioma atual
let currentLanguage = 'en';

// Função para traduzir a interface
function translateInterface(language) {
    console.log(`Translating interface to ${language}`);
    
    // Se o idioma for 'fr', substituir por 'th'
    if (language === 'fr') {
        language = 'th';
    }
    
    if (!translations[language]) {
        console.error(`Language ${language} not supported`);
        return;
    }
    
    currentLanguage = language;
    
    // Atualizar elementos da interface com as traduções
    try {
        // Atualizar mensagem de boas-vindas se existir
        const welcomeTitle = document.querySelector('#chat-section .welcome-message h3');
        if (welcomeTitle) {
            welcomeTitle.textContent = translations[language].welcome_title;
        }
        
        const welcomeDesc = document.querySelector('#chat-section .welcome-message p:nth-child(2)');
        if (welcomeDesc) {
            welcomeDesc.textContent = translations[language].welcome_description;
        }
        
        const welcomeTip = document.querySelector('#chat-section .welcome-message p:nth-child(3)');
        if (welcomeTip) {
            welcomeTip.textContent = translations[language].welcome_tip;
        }
        
        // Atualizar contador de créditos
        const creditsLabel = document.querySelector('.credits-counter-label');
        if (creditsLabel) {
            creditsLabel.textContent = translations[language].available_credits + ':';
        }
        
        const buyCreditsBtn = document.querySelector('#buy-credits-btn');
        if (buyCreditsBtn) {
            buyCreditsBtn.innerHTML = `<i class="fas fa-plus-circle"></i> ${translations[language].buy_credits}`;
        }
        
        // Atualizar botões de ação rápida
        document.querySelectorAll('.action-chip').forEach(btn => {
            const actionMatch = btn.getAttribute('onclick')?.match(/'([^']+)'/);
            if (actionMatch) {
                const action = actionMatch[1];
                switch (action) {
                    case 'get_wallet':
                        btn.innerHTML = `<i class="fas fa-wallet"></i> ${translations[language].view_wallet}`;
                        break;
                    case 'check_balance':
                        btn.innerHTML = `<i class="fas fa-coins"></i> ${translations[language].check_balance}`;
                        break;
                    case 'list_tokens':
                        btn.innerHTML = `<i class="fas fa-list"></i> ${translations[language].list_tokens}`;
                        break;
                    case 'get_tps':
                        btn.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${translations[language].network_tps}`;
                        break;
                    case 'fetch_price':
                        btn.innerHTML = `<i class="fas fa-tag"></i> ${translations[language].check_price}`;
                        break;
                }
            }
        });
        
        // Atualizar placeholder do input
        const userInputEl = document.getElementById('user-input');
        if (userInputEl) {
            userInputEl.placeholder = translations[language].type_command;
        }
        
        // Atualizar títulos das seções
        const creditsHeader = document.querySelector('#credits-section .section-header h2');
        if (creditsHeader) {
            creditsHeader.textContent = translations[language].chat_credits;
        }
        
        const marketHeader = document.querySelector('#market-section .section-header h2');
        if (marketHeader) {
            marketHeader.textContent = translations[language].market_overview;
        }
        
        const settingsHeader = document.querySelector('#settings-section .section-header h2');
        if (settingsHeader) {
            settingsHeader.textContent = translations[language].settings;
        }
        
        // Atualizar textos da seção de créditos
        const creditsInfo1 = document.querySelector('.credits-info p:nth-child(1)');
        if (creditsInfo1) {
            creditsInfo1.textContent = translations[language].credits_info_1;
        }
        
        const creditsInfo2 = document.querySelector('.credits-info p:nth-child(2)');
        if (creditsInfo2) {
            creditsInfo2.textContent = translations[language].credits_info_2;
        }
        
        const purchaseCreditsHeader = document.querySelector('.credits-packages h3');
        if (purchaseCreditsHeader) {
            purchaseCreditsHeader.textContent = translations[language].purchase_credits;
        }
        
        const transactionHistoryHeader = document.querySelector('.credits-history h3');
        if (transactionHistoryHeader) {
            transactionHistoryHeader.textContent = translations[language].transaction_history;
        }
        
        // Atualizar cabeçalhos da tabela de histórico
        const historyHeaders = document.querySelectorAll('.history-table th');
        if (historyHeaders.length >= 4) {
            historyHeaders[0].textContent = translations[language].date;
            historyHeaders[1].textContent = translations[language].type;
            historyHeaders[2].textContent = translations[language].amount;
            historyHeaders[3].textContent = translations[language].balance;
        }
        
        // Atualizar textos da seção de mercado
        const marketSearchInput = document.getElementById('market-search-input');
        if (marketSearchInput) {
            marketSearchInput.placeholder = translations[language].search_tokens;
        }
        
        const marketHeaders = document.querySelectorAll('.market-table th');
        if (marketHeaders.length >= 5) {
            marketHeaders[0].textContent = translations[language].token;
            marketHeaders[1].textContent = translations[language].price;
            marketHeaders[2].textContent = translations[language].change_24h;
            marketHeaders[3].textContent = translations[language].volume_24h;
            marketHeaders[4].textContent = translations[language].actions;
        }
        
        // Atualizar textos da seção de configurações
        const saveBtn = document.querySelector('#settings-section .save-btn');
        if (saveBtn) {
            saveBtn.innerHTML = `<i class="fas fa-save"></i> ${translations[language].save}`;
        }
        
        // Atualizar grupos de configurações
        const settingsGroups = document.querySelectorAll('#settings-section .settings-group h3');
        if (settingsGroups.length >= 6) {
            settingsGroups[0].textContent = translations[language].language;
            settingsGroups[1].textContent = translations[language].data_refresh;
            settingsGroups[2].textContent = translations[language].notifications;
            settingsGroups[3].textContent = translations[language].security;
            settingsGroups[4].textContent = translations[language].credits;
            settingsGroups[5].textContent = translations[language].about;
        }
        
        // Atualizar labels de configurações
        const languageLabel = document.querySelector('label[for="language-select"]');
        if (languageLabel) {
            languageLabel.textContent = translations[language].interface_language;
        }
        
        const autoRefreshLabel = document.querySelector('label[for="auto-refresh-toggle"]');
        if (autoRefreshLabel) {
            autoRefreshLabel.textContent = translations[language].auto_refresh;
        }
        
        const refreshIntervalLabel = document.querySelector('label[for="refresh-interval"]');
        if (refreshIntervalLabel) {
            refreshIntervalLabel.textContent = translations[language].refresh_interval;
        }
        
        const notificationsLabel = document.querySelector('label[for="notifications-toggle"]');
        if (notificationsLabel) {
            notificationsLabel.textContent = translations[language].enable_notifications;
        }
        
        const hideBalancesLabel = document.querySelector('label[for="hide-balances-toggle"]');
        if (hideBalancesLabel) {
            hideBalancesLabel.textContent = translations[language].hide_balances;
        }
        
        const transactionLimitLabel = document.querySelector('label[for="transaction-limit"]');
        if (transactionLimitLabel) {
            transactionLimitLabel.textContent = translations[language].transaction_limit;
        }
        
        const creditCostLabel = document.querySelector('label[for="credit-cost-per-message"]');
        if (creditCostLabel) {
            creditCostLabel.textContent = translations[language].credit_cost;
        }
        
        // Atualizar títulos das seções na barra superior
        const activeNavItem = document.querySelector('.nav-item.active');
        if (activeNavItem) {
            const currentSection = activeNavItem.getAttribute('data-section');
            const sectionTitle = document.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.textContent = `OBLIVION ON CHAIN ${currentSection.toUpperCase()}`;
            }
        }
        
    } catch (error) {
        console.error('Error translating interface:', error);
    }
    
    // Salvar a preferência de idioma
    localStorage.setItem('language', language);
    
    // Mostrar notificação
    showNotification(translations[language].language_changed);
    
    console.log(`Interface translated to ${language}`);
}

// Função para obter texto traduzido
function getTranslatedText(key, ...params) {
    let text = translations[currentLanguage][key] || key;
    
    // Substituir parâmetros se houver
    if (params.length > 0) {
        params.forEach((param, index) => {
            text = text.replace(`{${index}}`, param);
        });
    }
    
    return text;
}

// Modificar a função showNotification para usar traduções
function showNotification(messageKey, ...params) {
    const message = typeof messageKey === 'string' && translations[currentLanguage][messageKey] 
        ? getTranslatedText(messageKey, ...params)
        : messageKey; // Se não for uma chave de tradução, usar o texto diretamente
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the interface
    initializeInterface();
    
    // Set up event listeners
    setupEventListeners();
    
    // Adicionar contador de créditos ao chat
    addCreditsCounterToChat();
});

// Initialize the interface
async function initializeInterface() {
    try {
        // Get wallet address
        const walletResponse = await sendMcpRequest('get_wallet');
        walletAddress = walletResponse.result || 'Not available';
        walletAddressElement.textContent = formatWalletAddress(walletAddress);
        if (fullWalletAddressElement) {
            fullWalletAddressElement.textContent = walletAddress;
        }
        
        // Generate QR code if the element exists
        if (document.getElementById('wallet-qr-code') && walletAddress) {
            generateQRCode(walletAddress);
        }
        
        // Get wallet balance
        const balanceResponse = await sendMcpRequest('check_balance');
        walletBalanceElement.textContent = balanceResponse.result || '-- SOL';
        
        // Get TPS
        const tpsResponse = await sendMcpRequest('get_tps');
        tpsIndicatorElement.textContent = tpsResponse.result || '-- TPS';
        
        // Load credits
        if (document.getElementById('credits-list')) {
            await loadCredits();
        }
        
        // Load market data
        await loadMarketData();
        
        // Add welcome message
        addMessage(`
            <div class="welcome-message">
                <h3>👋 Welcome to Oblivion On Chain!</h3>
                <p>This futuristic interface allows you to interact with the Solana blockchain through simple commands.</p>
                <p>Try using the quick action buttons below or type a command directly.</p>
            </div>
        `, 'system');
        
        // Iniciar auto-refresh se estiver habilitado
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle && autoRefreshToggle.checked) {
            startMarketDataRefresh();
        }
        
        // Carregar configurações salvas primeiro
        loadSavedSettings();
        
        // Aplicar traduções com base no idioma carregado
        console.log(`Applying initial translation to ${currentLanguage}`);
        translateInterface(currentLanguage);
    } catch (error) {
        console.error('Error initializing interface:', error);
        walletAddressElement.textContent = 'Not connected';
        addMessage('Error connecting to MCP server. Please check if the server is running.', 'system');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            console.log(`Navegando para a seção: ${targetSection}`);
            
            // Update active navigation
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetSection}-section`) {
                    section.classList.add('active');
                    console.log(`Ativando seção: ${section.id}`);
                }
            });
            
            // Update section title
            document.querySelector('.section-title').textContent = 
                `OBLIVION ON CHAIN ${targetSection.toUpperCase()}`;
        });
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            const icon = refreshBtn.querySelector('i');
            if (icon) {
                icon.classList.add('rotating');
            }
            
            // Refresh data based on active section
            const activeSection = document.querySelector('.section.active');
            if (activeSection) {
                if (activeSection.id === 'market-section') {
                    await loadMarketData();
                } else if (activeSection.id === 'credits-section') {
                    await loadCredits();
                }
            }
            
            if (icon) {
                setTimeout(() => {
                    icon.classList.remove('rotating');
                }, 500);
            }
        });
    }
    
    // Token action buttons
    if (sendTokenBtn) {
        sendTokenBtn.addEventListener('click', () => {
            openModal(sendTokenModal);
        });
    }
    
    if (receiveTokenBtn) {
        receiveTokenBtn.addEventListener('click', () => {
            openModal(receiveTokenModal);
        });
    }
    
    if (swapTokenBtn) {
        swapTokenBtn.addEventListener('click', () => {
            addMessage('Swap functionality will be implemented in a future update.', 'system');
        });
    }
    
    // Modal close buttons
    document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Copy address button
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            copyToClipboard(walletAddress);
            showNotification('Address copied to clipboard!');
        });
    }
    
    // Confirm send button
    if (confirmSendBtn) {
        confirmSendBtn.addEventListener('click', async () => {
            await sendTokens();
        });
    }

    // Refresh market button
    if (document.getElementById('refresh-market-btn')) {
        document.getElementById('refresh-market-btn').addEventListener('click', loadMarketData);
    }

    // Chat input
    if (sendButton) {
        console.log('Adding click event to send button');
        sendButton.addEventListener('click', handleUserInput);
    } else {
        console.error('Send button not found');
    }
    
    if (userInput) {
        console.log('Adding keypress event to user input');
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserInput();
            }
        });
    } else {
        console.error('User input not found');
    }
    
    // Adicionar eventos aos botões de compra de créditos
    const packageBuyButtons = document.querySelectorAll('.package-buy-btn');
    packageBuyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Package buy button clicked');
            const amount = parseInt(this.getAttribute('data-amount'));
            const price = parseFloat(this.getAttribute('data-price'));
            console.log(`Opening payment modal for ${amount} credits at $${price}`);
            openPaymentModal(amount, price);
        });
    });
    
    // Evento para o botão de confirmar pagamento
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', processPayment);
    }

    // Auto-refresh para dados de mercado
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                startMarketDataRefresh();
            } else {
                stopMarketDataRefresh();
            }
        });
    }

    // Configurar listeners para pagamento em criptomoedas
    setupCryptoPaymentListeners();

    // Evento para salvar configurações
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        console.log('Adding click event to save settings button');
        saveSettingsBtn.addEventListener('click', function() {
            console.log('Save settings button clicked');
            saveSettings();
        });
    } else {
        console.error('Save settings button not found');
    }
    
    // Evento para alteração de idioma
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            // Não traduzimos imediatamente, apenas quando o usuário clicar em Salvar
            // Isso permite que o usuário veja a mudança antes de confirmar
            document.getElementById('language-select').value = e.target.value;
        });
    }
    
    // Evento para ocultar saldos
    const hideBalancesToggle = document.getElementById('hide-balances-toggle');
    if (hideBalancesToggle) {
        hideBalancesToggle.addEventListener('change', (e) => {
            // Aplicamos imediatamente para que o usuário veja o efeito
            applyHideBalances(e.target.checked);
        });
    }

    // Configurar botões de timeframe
    setupTimeframeButtons();
}

// Format wallet address for display
function formatWalletAddress(address) {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Generate QR code for wallet address
function generateQRCode(address) {
    const qrContainer = document.getElementById('wallet-qr-code');
    if (qrContainer && typeof QRCode !== 'undefined') {
        qrContainer.innerHTML = '';
        QRCode.toCanvas(qrContainer, address, {
            width: 200,
            margin: 1,
            color: {
                dark: '#ff6b00',
                light: '#1a1a1a'
            }
        }, function(error) {
            if (error) console.error('Error generating QR code:', error);
        });
    }
}

// Load credits
async function loadCredits() {
    if (!creditsList) return;
    
    try {
        creditsList.innerHTML = `
            <div class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading credits...</span>
            </div>
        `;
        
        const response = await sendMcpRequest('list_tokens');
        credits = response.result || [];
        
        renderCreditsList();
    } catch (error) {
        console.error('Error loading credits:', error);
        creditsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>Error loading credits. Please try again.</span>
            </div>
        `;
    }
}

// Render credits list
function renderCreditsList() {
    if (!creditsList || !credits.length) return;
    
    let totalValue = 0;
    let html = '';
    
    credits.forEach(credit => {
        totalValue += credit.value;
        
        html += `
            <div class="credit-item">
                <div class="credit-icon">${credit.symbol.charAt(0)}</div>
                <div class="credit-info">
                    <div class="credit-name">${credit.name}</div>
                    <div class="credit-symbol">${credit.symbol}</div>
                </div>
                <div class="credit-balance">
                    <div class="balance-amount">${formatNumber(credit.balance)} ${credit.symbol}</div>
                    <div class="balance-value">$${formatNumber(credit.value)}</div>
                </div>
            </div>
        `;
    });
    
    creditsList.innerHTML = html;
    
    if (totalTokenValueElement) {
        totalTokenValueElement.textContent = `$${formatNumber(totalValue)}`;
    }
    
    // Update token select options
    if (tokenSelect) {
        tokenSelect.innerHTML = '';
        credits.forEach(credit => {
            const option = document.createElement('option');
            option.value = credit.symbol;
            option.textContent = `${credit.symbol} - ${credit.name}`;
            tokenSelect.appendChild(option);
        });
    }
}

// Format number for display
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    } else if (num >= 1) {
        return num.toFixed(2);
    } else {
        return num.toFixed(6);
    }
}

// Open modal
function openModal(modal) {
    if (!modal) return;
    
    // Adicionar classe para mostrar o modal
    modal.classList.add('active');
    
    // Adicionar evento para fechar o modal ao clicar fora
    document.addEventListener('click', closeModalOutside);
    
    // Impedir que o scroll da página funcione enquanto o modal estiver aberto
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modal) {
    if (!modal) return;
    
    // Remover classe para esconder o modal
    modal.classList.remove('active');
    
    // Restaurar o scroll da página
    document.body.style.overflow = '';
    
    console.log('Modal closed');
}

// Close modal when clicking outside
function closeModalOutside(e) {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent && !modalContent.contains(e.target) && e.target !== modalContent) {
            closeModal(modal);
        }
    });
}

// Copy to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Send tokens
async function sendTokens() {
    if (!tokenSelect || !recipientAddress || !tokenAmount) return;
    
    const token = tokenSelect.value;
    const destination = recipientAddress.value.trim();
    const amount = parseFloat(tokenAmount.value);
    
    if (!destination) {
        showNotification('Please enter a recipient address');
        return;
    }
    
    if (!amount || isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid amount');
        return;
    }
    
    try {
        const response = await sendMcpRequest('send_tokens', {
            token,
            destination,
            amount
        });
        
        closeModal(sendTokenModal);
        addMessage(response.result, 'agent');
        
        // Clear form
        recipientAddress.value = '';
        tokenAmount.value = '';
        
        // Refresh credits
        await loadCredits();
    } catch (error) {
        showNotification(`Error: ${error.message}`);
    }
}

// Function to send action when clicking buttons
async function sendAction(action) {
    // Verificar se há créditos suficientes
    if (availableCredits < creditCostPerMessage) {
        showNotification('You do not have enough credits to send a message. Please purchase more credits.');
        return;
    }

    const actionMap = {
        'fetch_price': async () => {
            addMessage('Which token would you like to check the price for? (e.g., SOL, USDC, BTC)', 'agent');
            userInput.setAttribute('data-pending-action', 'fetch_price');
            userInput.focus();
            return null;
        },
        'default': async () => {
            addMessage(`Executing: ${action}`, 'system');
            
            // Deduzir créditos
            availableCredits -= creditCostPerMessage;
            updateCreditsDisplay();
            
            try {
                const response = await sendMcpRequest(action);
                return response;
            } catch (error) {
                addMessage(`Error executing ${action}: ${error.message}`, 'system');
                return null;
            }
        }
    };

    try {
        const handler = actionMap[action] || actionMap['default'];
        const response = await handler();
        
        if (response) {
            displayResponse(response);
        }
    } catch (error) {
        console.error(`Error in sendAction for ${action}:`, error);
        addMessage(`Error executing ${action}: ${error.message}`, 'system');
    }
}

// Function to handle user input
async function handleUserInput() {
    const text = userInput.value.trim();
    if (!text) return;
    
    // Verificar se há créditos suficientes
    if (availableCredits < creditCostPerMessage) {
        showNotification('You do not have enough credits to send a message. Please purchase more credits.');
        return;
    }

    // Adicionar mensagem do usuário ao chat
    addMessage(text, 'user');
    
    // Limpar input
    userInput.value = '';
    
    // Deduzir créditos
    availableCredits -= creditCostPerMessage;
    updateCreditsDisplay();

    // Verificar se há uma ação pendente
    const pendingAction = userInput.getAttribute('data-pending-action');
    if (pendingAction) {
        userInput.removeAttribute('data-pending-action');
        
        try {
            if (pendingAction === 'fetch_price') {
                const tokenSymbol = text.trim();
                console.log(`Requesting price for token: "${tokenSymbol}"`);
                const response = await sendMcpRequest('fetch_price', { token: tokenSymbol });
                displayResponse(response);
            }
        } catch (error) {
            console.error('Error handling pending action:', error);
            addMessage(`Error: ${error.message}`, 'system');
        }
        return;
    }

    // Processar comando do usuário
    try {
        // Verificar se é um comando conhecido
        if (isKnownCommand(text)) {
            console.log(`Executing known command: ${text}`);
            const response = await sendMcpRequest(text);
            displayResponse(response);
        } else {
            // Tentar interpretar como uma consulta genérica
            addMessage("Processing your request...", 'system');
            const response = await sendMcpRequest(text);
            displayResponse(response);
        }
    } catch (error) {
        console.error('Error processing user input:', error);
        addMessage(`Error: ${error.message}`, 'system');
    }
}

// Check if it's a known command
function isKnownCommand(text) {
    const knownCommands = [
        'get_wallet', 'check_balance', 'list_tokens', 
        'fetch_price', 'trade_tokens', 'get_tps', 
        'get_token_data'
    ];
    return knownCommands.includes(text);
}

// Function to send request to MCP server
async function sendMcpRequest(action, params = {}) {
    try {
        console.log(`Sending request to MCP server: ${action}`, params);
        
        const response = await fetch(MCP_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action,
                ...params
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Response from MCP server for ${action}:`, data);
        
        return data;
    } catch (error) {
        console.error('Error in MCP request:', error);
        throw error;
    }
}

// Function to display MCP response
function displayResponse(response) {
    if (!response) {
        addMessage('Could not get a response from the server.', 'system');
        return;
    }

    if (response.error) {
        addMessage(`Error: ${response.error}`, 'system');
        return;
    }

    // Format response depending on type
    let formattedResponse;
    
    if (typeof response.result === 'object') {
        if (Array.isArray(response.result)) {
            // Se for um array (como lista de tokens)
            if (response.result.length === 0) {
                formattedResponse = "No data available.";
            } else {
                // Formatar array de forma mais amigável
                formattedResponse = '<div class="response-list">';
                response.result.forEach(item => {
                    if (item.symbol && item.name) {
                        // Parece ser um token
                        formattedResponse += `
                            <div class="response-item">
                                <div class="response-item-header">
                                    <strong>${item.symbol}</strong> - ${item.name}
                                </div>
                                <div class="item-details">
                                    <div>Balance: ${formatNumber(item.balance || 0)} ${item.symbol}</div>
                                    ${item.price ? `<div>Price: $${formatNumber(item.price)}</div>` : ''}
                                    ${item.value ? `<div>Value: $${formatNumber(item.value)}</div>` : ''}
                                    ${item.change24h ? `<div class="${item.change24h >= 0 ? 'change-positive' : 'change-negative'}">
                                        24h Change: ${item.change24h >= 0 ? '+' : ''}${item.change24h.toFixed(2)}%
                                    </div>` : ''}
                                </div>
                            </div>
                        `;
                    } else {
                        // Outro tipo de item
                        formattedResponse += `<div class="response-item">${JSON.stringify(item)}</div>`;
                    }
                });
                formattedResponse += '</div>';
            }
        } else {
            // Objeto não-array
            formattedResponse = `<pre>${JSON.stringify(response.result, null, 2)}</pre>`;
        }
    } else {
        // String ou outro tipo primitivo
        // Verificar se é uma resposta de preço
        if (typeof response.result === 'string' && response.result.includes('Price of')) {
            const priceResponse = response.result;
            // Destacar o preço com cores
            if (priceResponse.includes('+')) {
                formattedResponse = priceResponse.replace(/\(\+([^%]+)%/, '(<span class="change-positive">+$1%</span>');
            } else if (priceResponse.includes('-')) {
                formattedResponse = priceResponse.replace(/\((\-[^%]+)%/, '(<span class="change-negative">$1%</span>');
            } else {
                formattedResponse = priceResponse;
            }
        } else {
            formattedResponse = response.result;
        }
    }

    addMessage(formattedResponse, 'agent');
}

// Function to add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    messageDiv.innerHTML = `
        <div class="message-time">${timeStr}</div>
        <div class="message-content">
            ${type === 'user' ? '' : '<i class="fas fa-' + (type === 'agent' ? 'robot' : 'info-circle') + ' message-icon"></i>'}
            <div class="message-text">${text}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the most recent message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Load market data
async function loadMarketData() {
    const marketTableBody = document.getElementById('market-table-body');
    if (!marketTableBody) return;
    
    try {
        marketTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-cell">
                    <i class="fas fa-spinner fa-spin"></i> Loading real-time market data...
                </td>
            </tr>
        `;
        
        let marketData;
        
        try {
            // Tentar obter dados reais
            const response = await sendMcpRequest('get_market_data');
            marketData = response.result;
            
            // Se não houver dados ou ocorrer um erro, usar dados de exemplo
            if (!marketData || !marketData.length) {
                console.log('No market data returned, using sample data');
                marketData = generateSampleMarketData();
            }
        } catch (error) {
            console.log('Error fetching market data, using sample data', error);
            marketData = generateSampleMarketData();
        }
        
        renderMarketTable(marketData);
        
        // Set up market search functionality
        const marketSearchInput = document.getElementById('market-search-input');
        if (marketSearchInput) {
            marketSearchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim().toLowerCase();
                renderMarketTable(marketData, searchTerm);
            });
        }
        
        // Set up timeframe buttons
        const timeframeBtns = document.querySelectorAll('.timeframe-btn');
        timeframeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                timeframeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // In a real implementation, you would update the chart here
                const timeframe = btn.getAttribute('data-timeframe');
                document.getElementById('chart-title').textContent = 
                    `SOL Price Chart (${timeframe})`;
            });
        });
        
        // Adicionar timestamp de atualização
        const marketHeader = document.querySelector('.section-header');
        if (marketHeader) {
            const timestampElement = document.createElement('div');
            timestampElement.className = 'update-timestamp';
            timestampElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
            marketHeader.appendChild(timestampElement);
        }
        
    } catch (error) {
        console.error('Error loading market data:', error);
        if (marketTableBody) {
            marketTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="error-cell">
                        <i class="fas fa-exclamation-circle"></i> Error loading market data. Please try again.
                    </td>
                </tr>
            `;
        }
    }
}

// Render market table
function renderMarketTable(marketData, searchTerm = '') {
    const marketTableBody = document.getElementById('market-table-body');
    if (!marketTableBody) return;
    
    // Filtrar dados com base no termo de pesquisa
    const filteredData = marketData.filter(token => {
        const searchLower = searchTerm.toLowerCase();
        return token.name.toLowerCase().includes(searchLower) || 
               token.symbol.toLowerCase().includes(searchLower);
    });
    
    // Ordenar por capitalização de mercado (preço * volume)
    filteredData.sort((a, b) => (b.price * b.volume24h) - (a.price * a.volume24h));
    
    let html = '';
    
    if (filteredData.length === 0) {
        html = `
            <tr>
                <td colspan="5" class="error-cell">
                    <i class="fas fa-search"></i> No tokens found matching "${searchTerm}"
                </td>
            </tr>
        `;
    } else {
        filteredData.forEach(token => {
            const changeClass = token.change24h >= 0 ? 'change-positive' : 'change-negative';
            const changeSign = token.change24h >= 0 ? '+' : '';
            
            html += `
                <tr>
                    <td>
                        <div class="token-cell">
                            <div class="token-icon-market">${token.symbol.charAt(0)}</div>
                            <div>
                                <div class="token-name-market">${token.name}</div>
                                <div class="token-symbol-market">${token.symbol}</div>
                            </div>
                        </div>
                    </td>
                    <td class="price-cell">$${token.price.toFixed(2)}</td>
                    <td class="change-cell ${changeClass}">${changeSign}${token.change24h}%</td>
                    <td class="volume-cell">$${formatNumber(token.volume24h)}</td>
                    <td>
                        <div class="actions-cell">
                            <button class="market-action-btn" onclick="showTokenChart('${token.symbol}')">
                                <i class="fas fa-chart-line"></i> Chart
                            </button>
                            <button class="market-action-btn" onclick="buyToken('${token.symbol}')">
                                <i class="fas fa-shopping-cart"></i> Buy
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    marketTableBody.innerHTML = html;
    
    // Atualizar timestamp
    const marketSection = document.getElementById('market-section');
    if (marketSection) {
        let timestampEl = marketSection.querySelector('.update-timestamp');
        if (!timestampEl) {
            timestampEl = document.createElement('div');
            timestampEl.className = 'update-timestamp';
            const refreshBtn = document.getElementById('refresh-market-btn');
            if (refreshBtn && refreshBtn.parentNode) {
                refreshBtn.parentNode.appendChild(timestampEl);
            }
        }
        
        const now = new Date();
        timestampEl.innerHTML = `
            Last updated: ${now.toLocaleTimeString()}
            <span class="real-time-indicator">LIVE</span>
        `;
    }
}

// Show token chart
function showTokenChart(symbol) {
    console.log(`Mostrando gráfico para ${symbol}`);
    currentChartSymbol = symbol;
    
    // Atualizar o título
    document.getElementById('chart-title').textContent = `${symbol} Price Chart`;
    
    // Adicionar classe para mostrar o gráfico e esconder o placeholder
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.classList.add('chart-active');
    
    // Obter o timeframe atual
    const activeTimeframeBtn = document.querySelector('.timeframe-btn.active');
    if (activeTimeframeBtn) {
        currentTimeframe = activeTimeframeBtn.getAttribute('data-timeframe');
    }
    
    // Carregar o widget do TradingView
    loadTradingViewWidget(symbol, currentTimeframe);
    
    // Atualizar o título da seção para incluir o símbolo do token
    document.querySelector('.chart-header h3').textContent = `${symbol} Price Chart (${currentTimeframe})`;
    
    // Mostrar notificação
    showNotification(`Carregando gráfico para ${symbol}`);
}

// Função para carregar o widget do TradingView
function loadTradingViewWidget(symbol, timeframe) {
    // Limpar o contêiner existente
    const container = document.getElementById('tradingview-widget-container');
    container.innerHTML = '';
    
    // Mapear símbolos para os símbolos do TradingView
    const symbolMap = {
        'BTC': 'BINANCE:BTCUSDT',
        'ETH': 'BINANCE:ETHUSDT',
        'SOL': 'BINANCE:SOLUSDT',
        'USDC': 'BINANCE:USDCUSDT',
        'BONK': 'BINANCE:BONKUSDT',
        'JUP': 'BINANCE:JUPUSDT',
        'RNDR': 'BINANCE:RNDRUSDT',
        'PYTH': 'BINANCE:PYTHUSDT',
        'USDT': 'BINANCE:USDTUSDC',
        'RAY': 'BINANCE:RAYUSDT'
    };
    
    // Obter o símbolo mapeado ou usar um padrão
    const tvSymbol = symbolMap[symbol] || `BINANCE:${symbol}USDT`;
    
    // Criar o widget
    tvWidget = new TradingView.widget({
        "autosize": true,
        "symbol": tvSymbol,
        "interval": timeframe,
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "br",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview-widget-container",
        "studies": [
            "Volume@tv-basicstudies"
        ]
    });
    
    // Mostrar o contêiner e esconder o placeholder
    container.style.display = 'block';
    document.getElementById('chart-placeholder').style.display = 'none';
}

// Configurar eventos para os botões de timeframe
function setupTimeframeButtons() {
    const timeframeBtns = document.querySelectorAll('.timeframe-btn');
    timeframeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualizar botão ativo
            timeframeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Obter novo timeframe
            const timeframe = btn.getAttribute('data-timeframe');
            currentTimeframe = timeframe;
            
            // Atualizar título
            document.getElementById('chart-title').textContent = 
                `${currentChartSymbol} Price Chart (${timeframe})`;
            
            // Recarregar o widget se um token estiver selecionado
            if (currentChartSymbol) {
                loadTradingViewWidget(currentChartSymbol, timeframe);
            }
        });
    });
}

// Modificar a função buyToken para mostrar o gráfico também
function buyToken(symbol) {
    // Mostrar o gráfico primeiro
    showTokenChart(symbol);
    
    // Mostrar notificação sobre a funcionalidade de compra
    showNotification(`Buy ${symbol} functionality will be implemented in a future update.`);
}

// Função para adicionar contador de créditos ao chat
function addCreditsCounterToChat() {
    const chatContainer = document.querySelector('.chat-container');
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatContainer && chatMessages) {
        const creditsCounter = document.createElement('div');
        creditsCounter.className = 'credits-counter';
        creditsCounter.innerHTML = `
            <div>
                <span class="credits-counter-label">${getTranslatedText('available_credits')}:</span>
                <span class="credits-counter-value" id="chat-credits-counter">${availableCredits}</span>
            </div>
            <button class="credits-counter-btn" id="buy-credits-btn">
                <i class="fas fa-plus-circle"></i> ${getTranslatedText('buy_credits')}
            </button>
        `;
        
        chatContainer.insertBefore(creditsCounter, chatMessages);
        
        // Adicionar evento ao botão de comprar créditos
        document.getElementById('buy-credits-btn').addEventListener('click', () => {
            // Navegar para a página de créditos
            const creditsNavItem = document.querySelector('.nav-item[data-section="credits"]');
            if (creditsNavItem) {
                creditsNavItem.click();
            }
        });
    }
}

// Função para atualizar a exibição de créditos
function updateCreditsDisplay() {
    // Atualizar contador no chat
    const chatCreditsCounter = document.getElementById('chat-credits-counter');
    if (chatCreditsCounter) {
        chatCreditsCounter.textContent = availableCredits;
    }
    
    // Atualizar na página de créditos
    const availableCreditsElement = document.getElementById('available-credits');
    if (availableCreditsElement) {
        availableCreditsElement.textContent = availableCredits;
    }
}

// Corrigir a função para abrir o modal de pagamento
function openPaymentModal(amount, price) {
    console.log(`Abrindo modal de pagamento para ${amount} créditos a $${price}`);
    const modal = document.getElementById('payment-modal');
    if (!modal) {
        console.error('Modal de pagamento não encontrado');
        return;
    }
    
    // Atualizar informações do pacote
    const packageAmountElement = document.getElementById('package-amount');
    const packagePriceElement = document.getElementById('package-price');
    
    if (packageAmountElement) {
        packageAmountElement.textContent = `${amount} Credits`;
    } else {
        console.error('Elemento de quantidade do pacote não encontrado');
    }
    
    if (packagePriceElement) {
        packagePriceElement.textContent = `$${price.toFixed(2)}`;
    } else {
        console.error('Elemento de preço do pacote não encontrado');
    }
    
    // Calcular preços em criptomoedas
    calculateCryptoPrices(price);
    
    // Gerar endereço de pagamento e QR code
    const paymentAddress = 'solana:5FHwkrdxD5AKmYoRvejJZVNBUg5PfEUXLYAQzg8RZxSP';
    const paymentAddressElement = document.getElementById('payment-address');
    
    if (paymentAddressElement) {
        paymentAddressElement.textContent = paymentAddress;
    } else {
        console.error('Elemento de endereço de pagamento não encontrado');
    }
    
    // Gerar QR code
    setTimeout(() => {
        generatePaymentQRCode(paymentAddress);
    }, 100);
    
    // Abrir o modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Modal de pagamento aberto');
}

// Adicionar fallback para o QR code caso a biblioteca falhe
function generateFallbackQRCode(address, container) {
    // Criar um QR code simples usando uma API externa
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(address)}&size=180x180&margin=1`;
    
    const img = document.createElement('img');
    img.src = qrCodeUrl;
    img.alt = 'Payment QR Code';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    container.innerHTML = '';
    container.appendChild(img);
    
    console.log('QR code de fallback gerado');
}

// Modificar a função generatePaymentQRCode para usar o fallback se necessário
function generatePaymentQRCode(address) {
    console.log('Gerando QR code para:', address);
    const qrContainer = document.getElementById('payment-qr-code');
    if (!qrContainer) {
        console.error('Contêiner do QR code não encontrado');
        return;
    }
    
    // Limpar o contêiner
    qrContainer.innerHTML = '';
    
    try {
        // Verificar se a biblioteca QRCode está disponível
        if (typeof QRCode === 'undefined') {
            console.error('Biblioteca QRCode não carregada, usando fallback');
            generateFallbackQRCode(address, qrContainer);
            return;
        }
        
        // Tentar gerar com a biblioteca QRCode
        try {
            QRCode.toCanvas(qrContainer, address, {
                width: 180,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, function(error) {
                if (error) {
                    console.error('Erro ao gerar QR code com biblioteca, usando fallback:', error);
                    generateFallbackQRCode(address, qrContainer);
                } else {
                    console.log('QR code gerado com sucesso');
                }
            });
        } catch (error) {
            console.error('Erro ao usar biblioteca QRCode, usando fallback:', error);
            generateFallbackQRCode(address, qrContainer);
        }
    } catch (error) {
        console.error('Erro geral ao gerar QR code, usando fallback:', error);
        generateFallbackQRCode(address, qrContainer);
    }
}

// Corrigir a função para processar o pagamento
function processPayment() {
    try {
        // Obter o método de pagamento selecionado
        const selectedMethod = document.querySelector('input[name="crypto-method"]:checked');
        const paymentMethod = selectedMethod ? selectedMethod.value : 'USDC';
        
        // Obter o valor do pacote
        const packageAmountElement = document.getElementById('package-amount');
        const packageAmount = packageAmountElement ? 
            parseInt(packageAmountElement.textContent.replace(/[^0-9]/g, '')) : 0;
        
        if (packageAmount <= 0) {
            console.error('Invalid package amount');
            showNotification('Error: Invalid package amount');
            return;
        }
        
        // Simular processamento de pagamento
        console.log(`Processing payment of ${packageAmount} credits with ${paymentMethod}`);
        
        // Atualizar créditos disponíveis
        availableCredits += packageAmount;
        updateCreditsDisplay();
        
        // Adicionar à história de transações
        const historyTable = document.querySelector('#credits-history table tbody');
        if (historyTable) {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${dateStr}</td>
                <td>Purchase (${paymentMethod})</td>
                <td>+${packageAmount}</td>
                <td>${availableCredits}</td>
            `;
            
            // Inserir no topo da tabela
            if (historyTable.firstChild) {
                historyTable.insertBefore(newRow, historyTable.firstChild);
            } else {
                historyTable.appendChild(newRow);
            }
        }
        
        // Fechar o modal
        const modal = document.getElementById('payment-modal');
        if (modal) {
            closeModal(modal);
        }
        
        // Mostrar notificação de sucesso
        showNotification('payment_successful', packageAmount);
        
    } catch (error) {
        console.error('Error processing payment:', error);
        showNotification('Error processing payment. Please try again.');
    }
}

// Adicionar função para configurar eventos do modal de pagamento
function setupPaymentModalEvents() {
    console.log('Configurando eventos do modal de pagamento');
    
    // Configurar botões de compra de pacotes
    const packageBuyButtons = document.querySelectorAll('.package-buy-btn');
    packageBuyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Botão de compra de pacote clicado');
            const amount = parseInt(this.getAttribute('data-amount'));
            const price = parseFloat(this.getAttribute('data-price'));
            console.log(`Abrindo modal de pagamento para ${amount} créditos a $${price}`);
            openPaymentModal(amount, price);
        });
    });
    
    // Configurar eventos do modal de pagamento
    const paymentModal = document.getElementById('payment-modal');
    if (paymentModal) {
        // Botão de fechar
        const closeBtn = paymentModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                console.log('Botão de fechar clicado');
                closeModal(paymentModal);
            });
        }
        
        // Botão de cancelar
        const cancelBtn = paymentModal.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                console.log('Botão de cancelar clicado');
                closeModal(paymentModal);
            });
        }
        
        // Botão de confirmar pagamento
        const confirmBtn = document.getElementById('confirm-payment-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                console.log('Botão de confirmar pagamento clicado');
                processPayment();
            });
        }
        
        // Botão de copiar endereço
        const copyBtn = document.getElementById('copy-payment-address');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                console.log('Botão de copiar endereço clicado');
                const address = document.getElementById('payment-address').textContent;
                copyToClipboard(address);
                showNotification('address_copied');
            });
        }
    }
}

// Adicionar ao evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, configurando eventos');
    
    // Configurar eventos do modal de pagamento
    setupPaymentModalEvents();
    
    // Resto do código existente...
});

// Modificar a função calculateCryptoPrices para incluir apenas USDC e USDT
async function calculateCryptoPrices(usdPrice) {
    try {
        // Em um cenário real, você buscaria taxas de câmbio atualizadas de uma API
        // Aqui estamos usando valores fixos para demonstração
        
        // Definir preços para USDC e USDT (normalmente 1:1 com USD)
        const usdcPrice = usdPrice; // 1 USDC = $1 USD
        const usdtPrice = usdPrice; // 1 USDT = $1 USD
        
        // Atualizar os elementos da interface
        const usdcPriceElement = document.getElementById('usdc-price');
        const usdtPriceElement = document.getElementById('usdt-price');
        
        if (usdcPriceElement) {
            usdcPriceElement.textContent = `${usdcPrice.toFixed(2)} USDC`;
        }
        
        if (usdtPriceElement) {
            usdtPriceElement.textContent = `${usdtPrice.toFixed(2)} USDT`;
        }
        
        return {
            usdc: usdcPrice,
            usdt: usdtPrice
        };
    } catch (error) {
        console.error('Error calculating crypto prices:', error);
        return {
            usdc: usdPrice,
            usdt: usdPrice
        };
    }
}

// Função para carregar configurações salvas
function loadSavedSettings() {
    // Carregar idioma
    const languageSelect = document.getElementById('language-select');
    const savedLanguage = localStorage.getItem('language');
    
    if (languageSelect) {
        console.log('Language select found, setting value to:', savedLanguage || 'en');
        if (savedLanguage && translations[savedLanguage]) {
            languageSelect.value = savedLanguage;
            currentLanguage = savedLanguage;
        } else {
            languageSelect.value = 'en';
            currentLanguage = 'en';
        }
    } else {
        console.error('Language select not found');
    }
    
    // Carregar configurações de atualização automática
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
    const savedAutoRefresh = localStorage.getItem('autoRefresh');
    if (autoRefreshToggle && savedAutoRefresh !== null) {
        autoRefreshToggle.checked = savedAutoRefresh === 'true';
    }
    
    const refreshIntervalInput = document.getElementById('refresh-interval');
    const savedRefreshInterval = localStorage.getItem('refreshInterval');
    if (refreshIntervalInput && savedRefreshInterval) {
        refreshIntervalInput.value = savedRefreshInterval;
    }
    
    // Carregar configurações de notificações
    const notificationsToggle = document.getElementById('notifications-toggle');
    const savedNotifications = localStorage.getItem('notifications');
    if (notificationsToggle && savedNotifications !== null) {
        notificationsToggle.checked = savedNotifications === 'true';
    }
    
    // Carregar configurações de segurança
    const hideBalancesToggle = document.getElementById('hide-balances-toggle');
    const savedHideBalances = localStorage.getItem('hideBalances');
    if (hideBalancesToggle && savedHideBalances !== null) {
        hideBalancesToggle.checked = savedHideBalances === 'true';
        applyHideBalances(savedHideBalances === 'true');
    }
    
    const transactionLimitInput = document.getElementById('transaction-limit');
    const savedTransactionLimit = localStorage.getItem('transactionLimit');
    if (transactionLimitInput && savedTransactionLimit) {
        transactionLimitInput.value = savedTransactionLimit;
    }
    
    // Carregar configurações de créditos
    const creditCostInput = document.getElementById('credit-cost-per-message');
    const savedCreditCost = localStorage.getItem('creditCostPerMessage');
    if (creditCostInput && savedCreditCost) {
        creditCostInput.value = savedCreditCost;
        applyCreditCostPerMessage(parseInt(savedCreditCost));
    }
    
    // Aplicar o idioma carregado
    translateInterface(currentLanguage);
}

// Adicionar função para iniciar refresh de dados de mercado se não existir
function startMarketDataRefresh(interval = 60) {
    // Limpar intervalo existente, se houver
    if (marketRefreshInterval) {
        clearInterval(marketRefreshInterval);
    }
    
    // Converter para milissegundos
    const refreshInterval = parseInt(interval) * 1000;
    
    // Iniciar novo intervalo
    marketRefreshInterval = setInterval(() => {
        // Verificar se a página de mercado está ativa
        const marketSection = document.getElementById('market-section');
        if (marketSection && marketSection.classList.contains('active')) {
            loadMarketData();
        }
    }, refreshInterval);
    
    console.log(`Market data auto-refresh started (interval: ${interval}s)`);
}

// Adicionar função para parar refresh de dados de mercado se não existir
function stopMarketDataRefresh() {
    if (marketRefreshInterval) {
        clearInterval(marketRefreshInterval);
        marketRefreshInterval = null;
        console.log('Market data auto-refresh stopped');
    }
}

// Adicionar este código ao final do arquivo para garantir que o evento seja adicionado
document.addEventListener('DOMContentLoaded', function() {
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        console.log('Adding direct click event to save settings button');
        saveSettingsBtn.onclick = function() {
            console.log('Save settings button clicked directly');
            saveSettings();
        };
    }
});

// Função para gerar dados de mercado de exemplo se a API não estiver disponível
function generateSampleMarketData() {
    const tokens = [
        { symbol: 'SOL', name: 'Solana' },
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'ETH', name: 'Ethereum' },
        { symbol: 'USDC', name: 'USD Coin' },
        { symbol: 'BONK', name: 'Bonk' },
        { symbol: 'JUP', name: 'Jupiter' },
        { symbol: 'RNDR', name: 'Render Token' },
        { symbol: 'PYTH', name: 'Pyth Network' },
        { symbol: 'USDT', name: 'Tether' },
        { symbol: 'RAY', name: 'Raydium' }
    ];
    
    return tokens.map(token => {
        // Gerar preço baseado no código ASCII do primeiro caractere (para consistência)
        const basePrice = token.symbol === 'BTC' ? 65000 : 
                         token.symbol === 'ETH' ? 3500 : 
                         token.symbol === 'SOL' ? 150 :
                         token.symbol === 'USDC' || token.symbol === 'USDT' ? 1 :
                         (token.symbol.charCodeAt(0) % 100) + 1;
        
        // Gerar variação de preço (entre -10% e +10%)
        const changePercent = ((token.symbol.charCodeAt(1) % 20) - 10) + (Math.random() * 2 - 1);
        
        // Gerar volume (baseado no preço)
        const volume = basePrice * 1000000 * (0.5 + Math.random());
        
        return {
            symbol: token.symbol,
            name: token.name,
            price: basePrice,
            change24h: parseFloat(changePercent.toFixed(2)),
            volume24h: volume
        };
    });
}

// Modificar a função loadMarketData para usar dados de exemplo se necessário
async function loadMarketData() {
    const marketTableBody = document.getElementById('market-table-body');
    if (!marketTableBody) return;
    
    try {
        marketTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-cell">
                    <i class="fas fa-spinner fa-spin"></i> Loading real-time market data...
                </td>
            </tr>
        `;
        
        let marketData;
        
        try {
            // Tentar obter dados reais
            const response = await sendMcpRequest('get_market_data');
            marketData = response.result;
            
            // Se não houver dados ou ocorrer um erro, usar dados de exemplo
            if (!marketData || !marketData.length) {
                console.log('No market data returned, using sample data');
                marketData = generateSampleMarketData();
            }
        } catch (error) {
            console.log('Error fetching market data, using sample data', error);
            marketData = generateSampleMarketData();
        }
        
        renderMarketTable(marketData);
        
        // Set up market search functionality
        const marketSearchInput = document.getElementById('market-search-input');
        if (marketSearchInput) {
            marketSearchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim().toLowerCase();
                renderMarketTable(marketData, searchTerm);
            });
        }
        
        // Set up timeframe buttons
        const timeframeBtns = document.querySelectorAll('.timeframe-btn');
        timeframeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                timeframeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // In a real implementation, you would update the chart here
                const timeframe = btn.getAttribute('data-timeframe');
                document.getElementById('chart-title').textContent = 
                    `SOL Price Chart (${timeframe})`;
            });
        });
        
        // Adicionar timestamp de atualização
        const marketHeader = document.querySelector('.section-header');
        if (marketHeader) {
            const timestampElement = document.createElement('div');
            timestampElement.className = 'update-timestamp';
            timestampElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
            marketHeader.appendChild(timestampElement);
        }
        
    } catch (error) {
        console.error('Error loading market data:', error);
        if (marketTableBody) {
            marketTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="error-cell">
                        <i class="fas fa-exclamation-circle"></i> Error loading market data. Please try again.
                    </td>
                </tr>
            `;
        }
    }
}