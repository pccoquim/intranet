// src/services/sessionManager.js
/**
 * Gerenciador de sessão para detectar inatividade do usuário
 */

class SessionManager {
  /**
   * Construtor do gerenciador de sessão
   * @param {Object} options - Opções de configuração
   * @param {number} [options.timeout=900000] - Tempo até o logout automático (em ms, 15min padrão)
   * @param {number} [options.warningTime=60000] - Tempo antes do timeout para mostrar aviso (em ms, 1min padrão)
   * @param {Function} [options.onTimeout] - Callback chamado quando o timeout ocorrer
   * @param {Function} [options.onWarning] - Callback chamado quando o aviso deve ser exibido
   * @param {Function} [options.onActivity] - Callback chamado quando há atividade do usuário
   * @param {Object} [options.authService] - Serviço de autenticação para realizar o logout
   */
  constructor(options = {}) {
    this.timeoutDuration = options.timeout || 15 * 60 * 1000; // 15 minutos por padrão
    this.warningTime = options.warningTime || 60 * 1000; // 1 minuto antes de expirar
    this.onTimeout = options.onTimeout || (() => {});
    this.onWarning = options.onWarning || (() => {});
    this.onActivity = options.onActivity || (() => {});
    this.authService = options.authService;
    
    this.timeoutId = null;
    this.warningId = null;
    this.isWarningDisplayed = false;
    
    this.handleUserActivity = this.handleUserActivity.bind(this);
    this.setupActivityListeners();
    this.startTimer();
  }
  
  /**
   * Configura os event listeners para detectar atividade do usuário
   */
  setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, this.handleUserActivity, { passive: true });
    });
  }
  
  /**
   * Manipula eventos de atividade do usuário
   */
  handleUserActivity() {
    // Se não estiver mostrando o aviso, resetar o timer
    if (!this.isWarningDisplayed) {
      this.resetTimer();
    }
    
    this.onActivity();
  }
  
  /**
   * Inicia os timers para aviso e logout
   */
  startTimer() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.warningId) clearTimeout(this.warningId);
    
    // Configurar aviso antes do timeout
    this.warningId = setTimeout(() => {
      this.isWarningDisplayed = true;
      this.onWarning();
    }, this.timeoutDuration - this.warningTime);
    
    // Configurar timeout para logout
    this.timeoutId = setTimeout(() => {
      this.handleTimeout();
    }, this.timeoutDuration);
  }
  
  /**
   * Reinicia os timers (usado após atividade do usuário)
   */
  resetTimer() {
    this.isWarningDisplayed = false;
    this.startTimer();
  }
  
  /**
   * Lida com o evento de timeout (logout automático)
   */
  handleTimeout() {
    if (this.authService) {
      this.authService.logout();
    }
    
    this.onTimeout();
  }
  
  /**
   * Limpa todos os timers e listeners (usado ao desmontar o componente)
   */
  destroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.warningId) clearTimeout(this.warningId);
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.removeEventListener(event, this.handleUserActivity);
    });
  }
}

export default SessionManager;