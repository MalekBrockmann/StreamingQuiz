// Media Streaming Quiz System
class QuizApp {
    constructor() {
        this.currentQuestion = 0;
        this.userAnswers = {};
        this.currentChapter = null;
        this.questions = [];
        this.toastContainer = this.createToastContainer();
        this.initializeLandingPage();
        this.setupKeyboardNavigation();
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        this.toastContainer.removeChild(toast);
                    }
                }, 300);
            }
        }, duration);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard navigation when quiz is active
            if (document.getElementById('quizInterface').style.display === 'none') return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.prevQuestion();
                    }
                    break;
                case 'ArrowRight':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.nextQuestion();
                    }
                    break;
                case 'Enter':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.checkCurrentAnswers();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.showLandingPage();
                    break;
                case 'r':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.resetCurrentQuestion();
                    }
                    break;
            }
        });
    }

    initializeLandingPage() {
        this.setupLandingPageEventListeners();
        // Add keyboard shortcuts info
        this.addKeyboardShortcutsInfo();
    }

    addKeyboardShortcutsInfo() {
        // Add a small info box about keyboard shortcuts
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.className = 'shortcuts-info';
        shortcutsInfo.innerHTML = `
            <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(255,255,255,0.9); 
                        padding: 15px; border-radius: 10px; font-size: 0.9rem; max-width: 300px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1); backdrop-filter: blur(10px);">
                <h4 style="margin: 0 0 10px 0; color: #333;">⌨️ Tastenkürzel:</h4>
                <div style="color: #666;">
                    <div><strong>Ctrl + ←/→</strong> Navigation</div>
                    <div><strong>Ctrl + Enter</strong> Prüfen</div>
                    <div><strong>Ctrl + R</strong> Reset</div>
                    <div><strong>Esc</strong> Zurück zum Menü</div>
                </div>
            </div>
        `;
        document.body.appendChild(shortcutsInfo);
    }

    setupLandingPageEventListeners() {
        // Chapter selection with enhanced feedback
        document.querySelectorAll('.chapter-card').forEach(card => {
            card.addEventListener('click', () => {
                const chapter = card.dataset.chapter;
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.startChapter(chapter);
                }, 150);
            });

            // Add ripple effect
            card.addEventListener('mousedown', (e) => {
                const ripple = document.createElement('div');
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                card.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Back to menu button
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showLandingPage();
            this.showToast('Zurück zum Hauptmenü', 'info');
        });
    }

    startChapter(chapter) {
        this.currentChapter = chapter;
        this.currentQuestion = 0;
        this.userAnswers = {};
        
        if (chapter === 'k1k2') {
            this.questions = this.initializeK1K2Questions();
            document.getElementById('quizTitle').textContent = 'Quiz K1 & K2 - Media Streaming';
            this.showToast('K1 & K2 Quiz gestartet - 15 Fragen', 'success');
        } else if (chapter === 'k3') {
            this.questions = this.initializeK3Questions();
            document.getElementById('quizTitle').textContent = 'Quiz K3 - Erweiterte Streaming-Technologien';
            this.showToast('K3 Quiz geladen', 'success');
        }

        // Error handling for empty chapters
        if (this.questions.length === 0) {
            this.showToast('Keine Fragen für dieses Kapitel vorhanden. Bitte Fragen bereitstellen.', 'warning');
            this.showLandingPage();
            return;
        }

        this.showQuizInterface();
        this.init();
    }

    showLandingPage() {
        const landingPage = document.getElementById('landingPage');
        const quizInterface = document.getElementById('quizInterface');
        
        // Smooth transition
        quizInterface.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            quizInterface.style.display = 'none';
            landingPage.style.display = 'flex';
            landingPage.style.animation = 'fadeInUp 0.6s ease';
        }, 300);
    }

    showQuizInterface() {
        const landingPage = document.getElementById('landingPage');
        const quizInterface = document.getElementById('quizInterface');
        
        // Smooth transition
        landingPage.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            landingPage.style.display = 'none';
            quizInterface.style.display = 'flex';
            quizInterface.style.animation = 'slideInFromRight 0.6s ease';
        }, 300);
    }

    initializeK1K2Questions() {
        return [
            {
                id: 1,
                type: 'drag-drop',
                title: 'Ordnen Sie die folgenden Themen/Begriffe den vier Kernproblemen des Media Streamings zu:',
                instruction: 'Ziehen Sie die Begriffe in die entsprechenden Kategorien.',
                items: [
                    'Schlechte Internetanbindung des Endkunden',
                    'Verfügbarkeit des Streaming Servers', 
                    'Flash-crowd events',
                    'Netzausbau',
                    'Konfiguration des Heimrouters',
                    'Verzögerungen bei der Übertragung der Datenpakete'
                ],
                zones: [
                    { id: 'qualitaet', title: 'Qualität', items: ['Flash-crowd events', 'Verzögerungen bei der Übertragung der Datenpakete'] },
                    { id: 'erreichbarkeit', title: 'Erreichbarkeit', items: ['Verfügbarkeit des Streaming Servers', 'Konfiguration des Heimrouters'] },
                    { id: 'kosten', title: 'Kosten', items: ['Netzausbau'] },
                    { id: 'durchsatz', title: 'Durchsatz', items: ['Flash-crowd events', 'Schlechte Internetanbindung des Endkunden'] }
                ]
            },
            {
                id: 2,
                type: 'drag-drop',
                title: 'Ordnen Sie die ASPs beziehungsweise Dienste den Netztechnologien zu. Mehrfachzuordnungen sind möglich.',
                instruction: 'Ziehen Sie die Dienste in die entsprechenden Netztechnologie-Kategorien.',
                items: [
                    'YouTube', 'Facebook', 'T-Entertain', 'Lineares Fernsehen (Live)', 'waipu-TV', 'Video on demand'
                ],
                zones: [
                    { id: 'multicast', title: 'IP-Multicast', items: ['T-Entertain', 'Lineares Fernsehen (Live)'] },
                    { id: 'webtv', title: 'Web-TV (offene Netze)', items: ['Lineares Fernsehen (Live)', 'waipu-TV'] },
                    { id: 'ott', title: 'OTT', items: ['Video on demand', 'Lineares Fernsehen (Live)'] },
                    { id: 'iptv', title: 'IPTV (geschlossene Netze)', items: ['T-Entertain', 'Lineares Fernsehen (Live)'] },
                    { id: 'cloud', title: 'Cloud', items: ['Facebook', 'YouTube', 'Lineares Fernsehen (Live)'] }
                ],
                allowMultiple: true
            },
            {
                id: 3,
                type: 'true-false-table',
                title: 'Richtig oder falsch?',
                instruction: 'Bewerten Sie jede Aussage als richtig oder falsch.',
                statements: [
                    { text: 'Für jeden Teilnehmer einer Gruppe wird in einem Teilnehmer nahegelegenen Router ein Paket erzeugt', correct: true },
                    { text: 'Das Loadsharing von Streaming Servern kann über Anycast realisiert werden', correct: true },
                    { text: 'Das Loadsharing von Streamingservern wird in der Regel über Multicast realisiert', correct: false },
                    { text: 'Livestreaming sollte immer über Broadcast realisiert werden um die mehrfache Übertragung von AV-Streams zu vermeiden', correct: false },
                    { text: 'Die Verbreitung von AV-Streams über Peer-to-Peer Netze ist zwangsläufig illegal', correct: false },
                    { text: 'Der größte Anteil des Streaming Verkehrs erfolgt über Unicast-Verbindungen', correct: true }
                ]
            },
            {
                id: 4,
                type: 'drag-drop',
                title: 'Ordnen Sie die unterschiedlichen Aussagen den vier grundlegenden Geschäftsmodellen zu:',
                instruction: 'Ziehen Sie die Aussagen zu den entsprechenden Geschäftsmodellen.',
                items: [
                    'Es besteht eine direkte bilaterale Geschäftsbeziehung zwischen dem Anbieter der A/V-Inhalte und dem Endkunden',
                    'Ein Netzbetreiber stellt seine Netzkunden A/V-Inhalte bereit',
                    'Der Inhaltenanbieter hat vollständige technische Kontrolle über die Videoübertragung auf der letzten Meile',
                    'Der Inhaltenanbieter kann keine Gewähr für die Übertragungsqualität geben',
                    'A/V Inhalte werden über eine Cloud bereitgestellt und abgerufen. Vertragliche Beziehungen gibt es in der Regel keine',
                    'Zwischen den Netzdienstleister und dem Inhalteanbieter besteht ein Vertragsverhältnis. Die Endkunden sind nicht involviert',
                    'Der Inhaltenanbieter kann die Qualität der Übertragung überwachen',
                    'Die Inhalte sind räumlich stark verteilt'
                ],
                zones: [
                    { id: 'ott_model', title: 'Over The Top (OTT)', items: [
                        'Der Inhaltenanbieter kann keine Gewähr für die Übertragungsqualität geben',
                        'Es besteht eine direkte bilaterale Geschäftsbeziehung zwischen dem Anbieter der A/V-Inhalte und dem Endkunden',
                        'Der Inhaltenanbieter kann die Qualität der Übertragung überwachen'
                    ]},
                    { id: 'club', title: 'Netzkunden-Club', items: [
                        'Ein Netzbetreiber stellt seine Netzkunden A/V-Inhalte bereit',
                        'Der Inhaltenanbieter kann die Qualität der Übertragung überwachen',
                        'Der Inhaltenanbieter hat vollständige technische Kontrolle über die Videoübertragung auf der letzten Meile'
                    ]},
                    { id: 'community', title: 'Cloud-based Community', items: [
                        'Der Inhaltenanbieter kann keine Gewähr für die Übertragungsqualität geben',
                        'A/V Inhalte werden über eine Cloud bereitgestellt und abgerufen. Vertragliche Beziehungen gibt es in der Regel keine',
                        'Die Inhalte sind räumlich stark verteilt',
                        'Der Inhaltenanbieter kann die Qualität der Übertragung überwachen'
                    ]},
                    { id: 'cdn', title: 'Content Delivery Network', items: [
                        'Die Inhalte sind räumlich stark verteilt',
                        'Der Inhaltenanbieter kann die Qualität der Übertragung überwachen',
                        'Zwischen den Netzdienstleister und dem Inhalteanbieter besteht ein Vertragsverhältnis. Die Endkunden sind nicht involviert'
                    ]}
                ]
            },
            {
                id: 5,
                type: 'fill-blank',
                title: 'Ergänzen Sie der Lückentext:',
                text: 'In deutschen Haushalten nutzen {16} % zwei unterschiedliche Abo-Streaming-Dienste.',
                answer: '16'
            },
            {
                id: 6,
                type: 'multiple-choice',
                title: 'Welcher der folgenden Aussagen stimmen?',
                instruction: 'Die folgenden Aussagen beziehen sich auf die zusätzlichen Abodienste Disney+, Apple TV+, Quibi.',
                options: [
                    { text: 'Haushalte, die bereits mindestens einen kostenpflichtigen Abo-Dienst gebucht haben, zeigen eine höhere Bereitschaft, weitere Abo-Dienste zu buchen', correct: true },
                    { text: 'Haushalte, die bereits zwei Abo-Dienst gebucht haben, zeigen eine geringere Bereitschaft, einen weiteren Abo-Dienst', correct: false },
                    { text: 'Haushalte, die bereits drei Abo-Dienste haben, zeigen eine größere Bereitschaft, einen weiteren Abo-Dienst zu buchen, als Haushalte, die erst einen Abo-Dienst gebucht haben.', correct: true },
                    { text: 'Haushalte, die noch keinen Abo-Dienst haben, zeigen die größte Bereitschaft, einen Abo-Dienst zu buchen', correct: false }
                ]
            },
            {
                id: 7,
                type: 'fill-blank',
                title: 'Ergänzen Sie den Lückentext:',
                text: 'Heute hat das private TV-Streaming über das Internet einen Anteil von ca. {80} % an dem gesamten Verkehrsaufkommen im Internet.',
                answer: '80'
            },
            {
                id: 8,
                type: 'multiple-choice',
                title: 'Was bedeutet im Zusammenhang mit Video-Streaming "Over the Top content" (OTT)?',
                instruction: 'Wählen Sie alle zutreffenden Aussagen aus.',
                options: [
                    { text: 'Um ruckfreie Videoübertragung zu gewährleisten bevorzugt das Internet die Videostreams bei der Übertragung', correct: false },
                    { text: 'Die Videostream wird zusätzlich auf ein zweites Gerät beim Empfänger gestreamt', correct: false },
                    { text: 'Der Internet-Service Provider hat keine Kontrolle über die Verbreitung von Video-Streams', correct: true },
                    { text: 'Das on-demand Portal hat keine Kontrolle über die Datenübertragung im Internet', correct: true }
                ]
            },
            {
                id: 9,
                type: 'true-false-table',
                title: 'Welche der folgenden Aussagen zu "Application Service Providern" (ASP) sind korrekt?',
                instruction: 'Bewerten Sie jede Aussage als richtig oder falsch.',
                statements: [
                    { text: 'Application Service Provider stellen die technische Infrastruktur bereit, um Anwendungen und Dienstleistungen ins Internet zu stellen', correct: true },
                    { text: 'Application Service Provider sind in der Regel über einen Commercial Exchange angebunden', correct: false },
                    { text: 'Cloud Services sind ein möglicher Dienst von Applications Service Providern', correct: true },
                    { text: 'Die Anbindung von Applications Service-Provider wird als "Peering" bezeichnet', correct: false }
                ]
            },
            {
                id: 10,
                type: 'true-false-table',
                title: 'Welche der folgenden Aussagen zum maximalen Datendurchsatz einer etablierten TCP-Verbindung sind korrekt?',
                instruction: 'Bewerten Sie jede Aussage als richtig oder falsch.',
                statements: [
                    { text: 'Der maximale Datendurchsatz ist die Fenstergröße der Flusskontrolle dividiert durch die RTT', correct: true },
                    { text: 'Der maximale Datendurchsatz ist die Maximum Transfer Unit im Verhältnis zur RTT', correct: false },
                    { text: 'Der maximale Datendurchsatz ist Maximum Segment Size im Verhältnis zur RTT', correct: false },
                    { text: 'Der maximale Datendurchsatz wird begrenzt durch die Überlastkontrolle', correct: true }
                ]
            },
            {
                id: 11,
                type: 'multiple-choice',
                title: 'Welche Schichten des Internet-Modells beinhalten Funktionalitäten der TCP/IP Protokollsuite?',
                instruction: 'Wählen Sie alle zutreffenden Schichten aus.',
                options: [
                    { text: 'Schicht 1', correct: false },
                    { text: 'Schicht 3', correct: true },
                    { text: 'Schicht 4', correct: true },
                    { text: 'Schicht 5', correct: false },
                    { text: 'Schicht 2', correct: false }
                ]
            },
            {
                id: 12,
                type: 'drag-drop',
                title: 'Ordnen Sie zu:',
                instruction: 'Ordnen Sie die Eigenschaften den entsprechenden Kategorien zu.',
                items: [
                    'logische Kapazität', 'Über Quittung bestätigt', 'Kapazität je Zugriff',
                    '65.536 Byte/Segment', 'Fragmentierung des Segments', 'physikalische Kapazität',
                    '1.500 Byte/Frame (Ethernet)', 'Segmentierung des AV-Streams'
                ],
                zones: [
                    { id: 'mss', title: 'Maximum Segment Size', items: [
                        'Segmentierung des AV-Streams', '65.536 Byte/Segment', 'logische Kapazität', 'Über Quittung bestätigt'
                    ]},
                    { id: 'mtu', title: 'Maximum Transfer Unit', items: [
                        'Kapazität je Zugriff', '1.500 Byte/Frame (Ethernet)', 'physikalische Kapazität', 'Fragmentierung des Segments'
                    ]}
                ]
            },
            {
                id: 13,
                type: 'drag-drop',
                title: 'Ordnen Sie die in der Spalte aufgeführten Eigenschaften den Transportprotokollen UDP und TCP jeweils richtig zu.',
                instruction: 'Mehrfachzuordnungen sind möglich.',
                items: [
                    'Prüfsumme', 'Überlastkontrolle', 'Paketlängenfeld im Header', 'HTTP-Protokoll',
                    'Socket mit Fragmentierungspuffer', 'Absicherung Transport', 'Adress-Tupel in der Adressierung',
                    'quittungsbasiert'
                ],
                zones: [
                    { id: 'udp', title: 'UDP', items: [
                        'Adress-Tupel in der Adressierung', 'Paketlängenfeld im Header', 'Prüfsumme'
                    ]},
                    { id: 'tcp', title: 'TCP', items: [
                        'HTTP-Protokoll', 'Adress-Tupel in der Adressierung', 'Überlastkontrolle',
                        'Absicherung Transport', 'Paketlängenfeld im Header', 'Socket mit Fragmentierungspuffer',
                        'quittungsbasiert', 'Prüfsumme'
                    ]}
                ],
                allowMultiple: true
            },
            {
                id: 14,
                type: 'multiple-choice',
                title: 'Welche Aussagen zu TCP und UDP sind korrekt?',
                instruction: 'Wählen Sie alle zutreffenden Aussagen aus.',
                options: [
                    { text: 'UDP ist ein einfacher und unzuverlässiger, dafür aber schneller Transportdienst mit geringen Verwaltungs-Overhead', correct: true },
                    { text: 'Beide Protokolle werden laufend und umfassend weiterentwickelt', correct: false },
                    { text: 'UDP wird aufgrund seiner Komplexität nur in Spezialfällen verwendet', correct: false },
                    { text: 'TCP bietet einen verbindungslosen Kommunikationsdienst', correct: false },
                    { text: 'Beide sind Protokolle der Transportschicht und bauen auf dem Datagrammdienst IP auf', correct: true },
                    { text: 'TCP gewährleistet einen zuverlässigen Datenaustausch, da es IP Übertragungsfehler behandeln kann', correct: true }
                ]
            },
            {
                id: 15,
                type: 'multiple-choice',
                title: 'Welche der folgenden Faktoren haben potenziell einen Einfluss auf die Performance einer Webseite?',
                instruction: 'Wählen Sie alle zutreffenden Faktoren aus.',
                options: [
                    { text: 'Einbettung von JavaScript', correct: true },
                    { text: 'Verwendung von SMTP', correct: false },
                    { text: 'Round Trip Time (RTT)', correct: true },
                    { text: 'Durchsatz', correct: true },
                    { text: 'HTTP-Version', correct: true },
                    { text: 'DNS lookup', correct: true },
                    { text: 'Persistente Verbindungen', correct: true },
                    { text: 'Pipelining', correct: true },
                    { text: 'Socket Programmierung', correct: false },
                    { text: 'MAC Adressen', correct: false },
                    { text: 'ARP Adressauflösung', correct: false },
                    { text: 'DHCP Request', correct: false }
                ]
            }
        ];
    }

    initializeK3Questions() {
        return [
            // K3 Fragen werden hier hinzugefügt, wenn vom Benutzer bereitgestellt
        ];
    }

    init() {
        this.renderQuestion();
        this.setupEventListeners();
        this.updateProgress();
        this.updateNavigation();
    }

    setupEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevQuestion());
        document.getElementById('checkBtn').addEventListener('click', () => this.checkCurrentAnswers());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetCurrentQuestion());
        document.getElementById('reviewBtn').addEventListener('click', () => this.showReview());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('quizContainer');
        
        container.innerHTML = `
            <div class="question active">
                <div class="question-header">
                    <h2 class="question-title">${question.title}</h2>
                    ${question.instruction ? `<p class="question-instruction">${question.instruction}</p>` : ''}
                </div>
                <div class="question-content">
                    ${this.renderQuestionContent(question)}
                </div>
            </div>
        `;

        if (question.type === 'drag-drop') {
            this.setupDragAndDrop(question);
        }

        this.loadSavedAnswer(question);
    }

    renderQuestionContent(question) {
        switch (question.type) {
            case 'drag-drop':
                return this.renderDragDrop(question);
            case 'multiple-choice':
                return this.renderMultipleChoice(question);
            case 'true-false-table':
                return this.renderTrueFalseTable(question);
            case 'fill-blank':
                return this.renderFillBlank(question);
            default:
                return '';
        }
    }

    renderDragDrop(question) {
        return `
            <div class="drag-drop-container">
                <div class="drag-source">
                    <h3>Verfügbare Optionen:</h3>
                    <div class="draggable-items" id="draggableItems">
                        ${question.items.map(item => 
                            `<div class="draggable-item" draggable="true" data-item="${item}">${item}</div>`
                        ).join('')}
                    </div>
                </div>
                <div class="drop-zones">
                    <h3>Kategorien:</h3>
                    ${question.zones.map(zone => `
                        <div class="drop-zone" data-zone="${zone.id}" id="zone-${zone.id}">
                            <div class="drop-zone-title">${zone.title}</div>
                            <div class="dropped-items"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderMultipleChoice(question) {
        return `
            <div class="answer-options">
                ${question.options.map((option, index) => `
                    <label class="answer-option">
                        <input type="checkbox" name="q${question.id}" value="${index}" 
                               onchange="quiz.saveAnswer(${question.id}, this)">
                        ${option.text}
                    </label>
                `).join('')}
            </div>
        `;
    }

    renderTrueFalseTable(question) {
        return `
            <div class="true-false-table">
                ${question.statements.map((statement, index) => `
                    <div class="statement-row" style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="flex: 1; margin-right: 20px;">${statement.text}</div>
                        <div class="statement-options" style="display: flex; gap: 15px;">
                            <label class="answer-option" style="margin: 0; padding: 8px 15px; background: white; border: 2px solid #ddd; border-radius: 5px; cursor: pointer;">
                                <input type="radio" name="q${question.id}_${index}" value="true" 
                                       onchange="quiz.saveAnswer(${question.id}, this)" style="margin-right: 5px;">
                                Richtig
                            </label>
                            <label class="answer-option" style="margin: 0; padding: 8px 15px; background: white; border: 2px solid #ddd; border-radius: 5px; cursor: pointer;">
                                <input type="radio" name="q${question.id}_${index}" value="false" 
                                       onchange="quiz.saveAnswer(${question.id}, this)" style="margin-right: 5px;">
                                Falsch
                            </label>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderFillBlank(question) {
        const textWithBlanks = question.text.replace(/{([^}]+)}/g, 
            `<input type="text" class="blank-input" onchange="quiz.saveAnswer(${question.id}, this)" placeholder="?">`
        );
        
        return `
            <div class="fill-blank">
                <p>${textWithBlanks}</p>
            </div>
        `;
    }

    setupDragAndDrop(question) {
        const setupDragForElement = (element) => {
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.item);
                e.target.classList.add('dragging');
            });

            element.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        };

        // Setup for initial draggable items
        document.querySelectorAll('.draggable-item').forEach(setupDragForElement);
        
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const itemText = e.dataTransfer.getData('text/plain');
                const droppedItems = zone.querySelector('.dropped-items');

                // Prüfe, ob das Item schon in dieser Zone ist (keine Duplikate pro Zone)
                const existingItem = droppedItems.querySelector(`[data-item="${itemText}"]`);
                if (existingItem) return;

                // Kopiere das Item (nie aus der Bank entfernen)
                const droppedItem = document.createElement('div');
                droppedItem.className = 'dropped-item';
                droppedItem.textContent = itemText;
                droppedItem.setAttribute('data-item', itemText);
                droppedItem.draggable = true;

                // Doppelklick entfernt das Item wieder aus der Zone
                droppedItem.addEventListener('dblclick', () => {
                    droppedItem.remove();
                    this.saveDragDropAnswer(question.id);
                });

                // Setup drag functionality for the dropped item
                this.setupDragOutForItem(droppedItem, question);
                setupDragForElement(droppedItem);
                droppedItems.appendChild(droppedItem);

                // Validierung (nur falls erlaubt)
                this.validateDragDropAnswer(question, zone, itemText);
                this.saveDragDropAnswer(question.id);
            });
        });
    }

    setupDragOutForItem(droppedItem, question) {
        droppedItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', droppedItem.getAttribute('data-item'));
            e.dataTransfer.setData('drag-source', 'dropped-item');
            droppedItem.classList.add('dragging');
            
            // Store reference to the original zone for drag out
            e.dataTransfer.setData('original-zone', droppedItem.closest('.drop-zone').id);
        });

        droppedItem.addEventListener('dragend', (e) => {
            droppedItem.classList.remove('dragging');
        });

        // Make drop zones accept items being dragged out
        const allZones = document.querySelectorAll('.drop-zone');
        allZones.forEach(zone => {
            // Remove existing drag out listeners to avoid duplicates
            const existingHandler = zone._dragOutHandler;
            if (existingHandler) {
                zone.removeEventListener('drop', existingHandler);
            }

            // Create new drag out handler
            const dragOutHandler = (e) => {
                const dragSource = e.dataTransfer.getData('drag-source');
                const itemText = e.dataTransfer.getData('text/plain');
                const originalZoneId = e.dataTransfer.getData('original-zone');
                
                if (dragSource === 'dropped-item') {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    
                    // Remove item from original zone
                    const originalZone = document.getElementById(originalZoneId);
                    if (originalZone) {
                        const itemToRemove = originalZone.querySelector(`[data-item="${itemText}"]`);
                        if (itemToRemove) {
                            itemToRemove.remove();
                        }
                    }
                    
                    // Only add to new zone if it's different from the original
                    if (zone.id !== originalZoneId) {
                        const droppedItems = zone.querySelector('.dropped-items');
                        
                        // Check if item already exists in this zone
                        const existingItem = droppedItems.querySelector(`[data-item="${itemText}"]`);
                        if (!existingItem) {
                            // Create new dropped item in the target zone
                            const newDroppedItem = document.createElement('div');
                            newDroppedItem.className = 'dropped-item';
                            newDroppedItem.textContent = itemText;
                            newDroppedItem.setAttribute('data-item', itemText);
                            newDroppedItem.draggable = true;

                            // Setup drag out functionality for the new item
                            this.setupDragOutForItem(newDroppedItem, question);

                            // Doppelklick entfernt das Item wieder aus der Zone
                            newDroppedItem.addEventListener('dblclick', () => {
                                newDroppedItem.remove();
                                this.saveDragDropAnswer(question.id);
                            });

                            droppedItems.appendChild(newDroppedItem);
                        }
                    }
                    
                    // Save the updated state
                    this.saveDragDropAnswer(question.id);
                }
            };

            // Store handler reference for future removal
            zone._dragOutHandler = dragOutHandler;
            zone.addEventListener('drop', dragOutHandler);
        });

        // Also allow dragging back to the original drag source area
        const dragSource = document.querySelector('.drag-source');
        if (dragSource && !dragSource._dragBackSetup) {
            dragSource._dragBackSetup = true;
            
            dragSource.addEventListener('dragover', (e) => {
                const dragSourceType = e.dataTransfer.types.includes('drag-source') ? 
                    e.dataTransfer.getData('drag-source') : null;
                if (dragSourceType === 'dropped-item') {
                    e.preventDefault();
                    dragSource.classList.add('drag-over');
                }
            });

            dragSource.addEventListener('dragleave', () => {
                dragSource.classList.remove('drag-over');
            });

            dragSource.addEventListener('drop', (e) => {
                const dragSourceType = e.dataTransfer.getData('drag-source');
                if (dragSourceType === 'dropped-item') {
                    e.preventDefault();
                    dragSource.classList.remove('drag-over');
                    
                    const itemText = e.dataTransfer.getData('text/plain');
                    const originalZoneId = e.dataTransfer.getData('original-zone');
                    
                    // Remove from original zone
                    const originalZone = document.getElementById(originalZoneId);
                    if (originalZone) {
                        const itemToRemove = originalZone.querySelector(`[data-item="${itemText}"]`);
                        if (itemToRemove) {
                            itemToRemove.remove();
                            this.saveDragDropAnswer(question.id);
                        }
                    }
                }
            });
        }
    }

    saveAnswer(questionId, element) {
        const question = this.questions.find(q => q.id === questionId);
        
        if (question.type === 'multiple-choice') {
            const checked = Array.from(document.querySelectorAll(`input[name="q${questionId}"]:checked`))
                .map(input => parseInt(input.value));
            this.userAnswers[questionId] = checked;
        } else if (question.type === 'true-false-table') {
            const answers = {};
            question.statements.forEach((_, index) => {
                const selected = document.querySelector(`input[name="q${questionId}_${index}"]:checked`);
                if (selected) {
                    answers[index] = selected.value === 'true';
                }
            });
            this.userAnswers[questionId] = answers;
        } else if (question.type === 'fill-blank') {
            this.userAnswers[questionId] = element.value;
        }
        
        this.saveToLocalStorage();
    }

    validateDragDropAnswer(question, zone, itemText) {
        // Skip immediate validation for questions with multiple assignments allowed
        if (question.allowMultiple) {
            return; // No immediate feedback for multiple assignment questions
        }
        
        const zoneId = zone.dataset.zone;
        const correctZone = question.zones.find(z => z.id === zoneId);
        const isCorrect = correctZone && correctZone.items.includes(itemText);
        
        // Find the dropped item that was just added
        const droppedItem = zone.querySelector(`[data-item="${itemText}"]:last-child`);
        
        if (droppedItem) {
            // Remove any existing validation classes
            droppedItem.classList.remove('correct-drop', 'incorrect-drop');
            
            // Add appropriate class with animation
            if (isCorrect) {
                droppedItem.classList.add('correct-drop');
                // Show success feedback
                this.showDropFeedback(zone, 'correct', '✓ Richtig!');
            } else {
                droppedItem.classList.add('incorrect-drop');
                // Show error feedback
                this.showDropFeedback(zone, 'incorrect', '✗ Falsch!');
                
                // Optional: Auto-remove incorrect items after 2 seconds
                setTimeout(() => {
                    if (droppedItem.parentNode) {
                        droppedItem.remove();
                        this.saveDragDropAnswer(question.id);
                        this.hideDropFeedback(zone);
                    }
                }, 2000);
            }
        }
    }

    showDropFeedback(zone, type, message) {
        // Remove existing feedback
        const existingFeedback = zone.querySelector('.drop-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `drop-feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: absolute;
            top: -30px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
            animation: feedbackPop 0.3s ease;
            ${type === 'correct' ? 
                'background: #4CAF50; color: white;' : 
                'background: #f44336; color: white;'
            }
        `;

        // Add relative positioning to zone if not already set
        if (getComputedStyle(zone).position === 'static') {
            zone.style.position = 'relative';
        }

        zone.appendChild(feedback);

        // Auto-remove feedback after 3 seconds
        setTimeout(() => {
            this.hideDropFeedback(zone);
        }, 3000);
    }

    hideDropFeedback(zone) {
        const feedback = zone.querySelector('.drop-feedback');
        if (feedback) {
            feedback.style.animation = 'feedbackFadeOut 0.3s ease';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.remove();
                }
            }, 300);
        }
    }

    saveDragDropAnswer(questionId) {
        const zones = {};
        document.querySelectorAll('.drop-zone').forEach(zone => {
            const zoneId = zone.dataset.zone;
            const items = Array.from(zone.querySelectorAll('.dropped-item'))
                .map(item => item.dataset.item);
            zones[zoneId] = items;
        });
        this.userAnswers[questionId] = zones;
        this.saveToLocalStorage();
    }

    loadSavedAnswer(question) {
        const savedAnswer = this.userAnswers[question.id];
        if (!savedAnswer) return;

        if (question.type === 'multiple-choice') {
            savedAnswer.forEach(index => {
                const checkbox = document.querySelector(`input[name="q${question.id}"][value="${index}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } else if (question.type === 'true-false-table') {
            Object.entries(savedAnswer).forEach(([index, value]) => {
                const radio = document.querySelector(`input[name="q${question.id}_${index}"][value="${value}"]`);
                if (radio) radio.checked = true;
            });
        } else if (question.type === 'fill-blank') {
            const input = document.querySelector('.blank-input');
            if (input) input.value = savedAnswer;
        } else if (question.type === 'drag-drop') {
            Object.entries(savedAnswer).forEach(([zoneId, items]) => {
                const zone = document.querySelector(`#zone-${zoneId}`);
                if (zone) {
                    items.forEach(itemText => {
                        // Remove from original location only if not allowing multiples
                        if (!question.allowMultiple) {
                            const originalItem = document.querySelector(`[data-item="${itemText}"]`);
                            if (originalItem) originalItem.remove();
                        }

                        const droppedItem = document.createElement('div');
                        droppedItem.className = 'dropped-item';
                        droppedItem.textContent = itemText;
                        droppedItem.setAttribute('data-item', itemText);
                        droppedItem.draggable = true;
                        
                        // Setup drag out functionality for loaded items
                        this.setupDragOutForItem(droppedItem, question);
                        
                        zone.appendChild(droppedItem);
                    });
                }
            });
        }
    }

    checkCurrentAnswers() {
        const question = this.questions[this.currentQuestion];
        const container = document.querySelector('.question.active');
        let correctCount = 0;
        let totalCount = 0;
        
        // Remove any existing feedback
        container.querySelectorAll('.check-feedback').forEach(el => el.remove());
        container.classList.add('checked');
        
        switch (question.type) {
            case 'multiple-choice':
                ({ correctCount, totalCount } = this.checkMultipleChoice(question, container));
                break;
            case 'true-false-table':
                ({ correctCount, totalCount } = this.checkTrueFalseTable(question, container));
                break;
            case 'drag-drop':
                ({ correctCount, totalCount } = this.checkDragDrop(question, container));
                break;
            case 'fill-blank':
                ({ correctCount, totalCount } = this.checkFillBlank(question, container));
                break;
        }
        
        // Enhanced feedback with detailed results
        const percentage = Math.round((correctCount / totalCount) * 100);
        let feedbackMessage = '';
        let feedbackType = '';
        
        if (percentage === 100) {
            feedbackMessage = `Perfekt! Alle ${totalCount} Antworten richtig! 🎉`;
            feedbackType = 'success';
        } else if (percentage >= 80) {
            feedbackMessage = `Sehr gut! ${correctCount}/${totalCount} richtig (${percentage}%) 👏`;
            feedbackType = 'success';
        } else if (percentage >= 60) {
            feedbackMessage = `Gut! ${correctCount}/${totalCount} richtig (${percentage}%) 👍`;
            feedbackType = 'warning';
        } else {
            feedbackMessage = `${correctCount}/${totalCount} richtig (${percentage}%). Versuchen Sie es nochmal! 💪`;
            feedbackType = 'error';
        }
        
        this.showToast(feedbackMessage, feedbackType, 4000);
    }

    checkMultipleChoice(question, container) {
        const options = container.querySelectorAll('.answer-option');
        let correctCount = 0;
        let totalCount = 0;
        
        options.forEach((option, index) => {
            const checkbox = option.querySelector('input');
            const isSelected = checkbox.checked;
            const isCorrect = question.options[index].correct;
            
            option.classList.remove('correct-answer', 'incorrect-answer');
            
            if (isSelected) {
                if (isCorrect) {
                    option.classList.add('correct-answer');
                    this.addCheckFeedback(option, '✓ Richtig', 'correct');
                    correctCount++;
                } else {
                    option.classList.add('incorrect-answer');
                    this.addCheckFeedback(option, '✗ Falsch', 'incorrect');
                }
                totalCount++;
            } else if (isCorrect) {
                option.classList.add('incorrect-answer');
                this.addCheckFeedback(option, '✗ Nicht ausgewählt (sollte richtig sein)', 'incorrect');
                totalCount++;
            }
        });
        
        return { correctCount, totalCount };
    }

    checkTrueFalseTable(question, container) {
        const statements = container.querySelectorAll('.statement-row');
        let correctCount = 0;
        let totalCount = 0;
        
        statements.forEach((row, index) => {
            const selectedRadio = row.querySelector('input[type="radio"]:checked');
            const trueRadio = row.querySelector('input[value="true"]');
            const falseRadio = row.querySelector('input[value="false"]');
            const isCorrect = question.statements[index].correct;
            
            // Reset classes
            trueRadio.parentElement.classList.remove('correct-answer', 'incorrect-answer');
            falseRadio.parentElement.classList.remove('correct-answer', 'incorrect-answer');
            
            if (selectedRadio) {
                const selectedValue = selectedRadio.value === 'true';
                if (selectedValue === isCorrect) {
                    selectedRadio.parentElement.classList.add('correct-answer');
                    this.addCheckFeedback(selectedRadio.parentElement, '✓ Richtig', 'correct');
                    correctCount++;
                } else {
                    selectedRadio.parentElement.classList.add('incorrect-answer');
                    this.addCheckFeedback(selectedRadio.parentElement, '✗ Falsch', 'incorrect');
                }
                totalCount++;
            } else {
                // No answer selected
                const correctOption = isCorrect ? trueRadio.parentElement : falseRadio.parentElement;
                correctOption.classList.add('incorrect-answer');
                this.addCheckFeedback(correctOption, '✗ Nicht beantwortet', 'incorrect');
                totalCount++;
            }
        });
        
        return { correctCount, totalCount };
    }

    checkDragDrop(question, container) {
        // NEUE STRATEGIE: Erstelle eine Karte aller Items und ihrer aktuellen Positionen
        const allPlacedItems = new Map(); // item -> array of zones where it's placed
        const dropZones = container.querySelectorAll('.drop-zone');
        
        // Sammle alle platzierten Items und ihre Positionen
        dropZones.forEach(zone => {
            const zoneId = zone.dataset.zone;
            const droppedItems = zone.querySelectorAll('.dropped-item:not([style*="italic"])');
            
            Array.from(droppedItems).forEach(item => {
                const itemText = item.textContent.trim();
                if (!allPlacedItems.has(itemText)) {
                    allPlacedItems.set(itemText, []);
                }
                allPlacedItems.get(itemText).push({
                    zone: zoneId,
                    element: item
                });
            });
        });
        
        // Erstelle eine Karte der korrekten Antworten: item -> array of correct zones
        const correctAnswers = new Map();
        question.zones.forEach(zone => {
            zone.items.forEach(item => {
                if (!correctAnswers.has(item)) {
                    correctAnswers.set(item, []);
                }
                correctAnswers.get(item).push(zone.id);
            });
        });
        
        // Markiere alle platzierten Items als richtig/falsch
        allPlacedItems.forEach((placements, itemText) => {
            const correctZones = correctAnswers.get(itemText) || [];
            
            placements.forEach(placement => {
                const isCorrect = correctZones.includes(placement.zone);
                placement.element.classList.remove('correct-answer', 'incorrect-answer');
                
                if (isCorrect) {
                    placement.element.classList.add('correct-answer');
                    this.addCheckFeedback(placement.element, '✓', 'correct');
                } else {
                    placement.element.classList.add('incorrect-answer');
                    this.addCheckFeedback(placement.element, '✗', 'incorrect');
                }
            });
        });
        
        // Zeige fehlende Items NUR für Items, die nirgendwo korrekt platziert sind
        correctAnswers.forEach((correctZones, itemText) => {
            // Prüfe ob das Item irgendwo korrekt platziert ist
            const isCorrectlyPlacedSomewhere = allPlacedItems.has(itemText) && 
                allPlacedItems.get(itemText).some(placement => 
                    correctZones.includes(placement.zone)
                );
            
            // Wenn das Item nirgendwo korrekt ist, zeige es als fehlend in EINER seiner korrekten Zonen
            if (!isCorrectlyPlacedSomewhere) {
                // Wähle die erste korrekte Zone für die "Fehlt:" Anzeige
                const firstCorrectZone = correctZones[0];
                const zoneElement = container.querySelector(`[data-zone="${firstCorrectZone}"]`);
                
                if (zoneElement) {
                    const missingIndicator = document.createElement('div');
                    missingIndicator.className = 'dropped-item incorrect-answer';
                    missingIndicator.textContent = `Fehlt: ${itemText}`;
                    missingIndicator.style.fontStyle = 'italic';
                    missingIndicator.style.opacity = '0.7';
                    zoneElement.querySelector('.dropped-items').appendChild(missingIndicator);
                    this.addCheckFeedback(missingIndicator, '✗', 'incorrect');
                }
            }
        });
        
        return { correctCount: correctAnswers.size, totalCount: allPlacedItems.size };
    }

    checkFillBlank(question, container) {
        const input = container.querySelector('.blank-input');
        const userAnswer = input.value.trim();
        const correctAnswer = question.answer;
        
        input.classList.remove('correct-answer', 'incorrect-answer');
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            input.classList.add('correct-answer');
            this.addCheckFeedback(input, '✓ Richtig', 'correct');
            return { correctCount: 1, totalCount: 1 };
        } else {
            input.classList.add('incorrect-answer');
            this.addCheckFeedback(input, `✗ Falsch (Korrekt: ${correctAnswer})`, 'incorrect');
            return { correctCount: 0, totalCount: 1 };
        }
    }

    addCheckFeedback(element, text, type) {
        const feedback = document.createElement('span');
        feedback.className = `check-feedback ${type}`;
        feedback.textContent = text;
        element.appendChild(feedback);
    }

    resetCurrentQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.querySelector('.question.active');
        
        // Remove checked state and feedback
        container.classList.remove('checked');
        container.querySelectorAll('.check-feedback').forEach(el => el.remove());
        
        switch (question.type) {
            case 'multiple-choice':
                this.resetMultipleChoice(container);
                break;
            case 'true-false-table':
                this.resetTrueFalseTable(container);
                break;
            case 'drag-drop':
                this.resetDragDrop(container);
                break;
            case 'fill-blank':
                this.resetFillBlank(container);
                break;
        }
        
        // Clear saved answers for this question
        if (this.userAnswers[question.id]) {
            delete this.userAnswers[question.id];
            this.saveToLocalStorage();
        }
        
        this.showToast('Frage zurückgesetzt', 'info', 2000);
    }

    resetMultipleChoice(container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove('correct-answer', 'incorrect-answer');
        });
    }

    resetTrueFalseTable(container) {
        const radios = container.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.checked = false;
            radio.parentElement.classList.remove('correct-answer', 'incorrect-answer');
        });
    }

    resetDragDrop(container) {
        // Remove all dropped items from zones
        const dropZones = container.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            const droppedItems = zone.querySelectorAll('.dropped-item');
            droppedItems.forEach(item => item.remove());
        });
        
        // Reset original draggable items (make sure they're all visible)
        const question = this.questions[this.currentQuestion];
        const dragSource = container.querySelector('.draggable-items');
        if (dragSource) {
            dragSource.innerHTML = '';
            question.items.forEach(item => {
                const dragItem = document.createElement('div');
                dragItem.className = 'draggable-item';
                dragItem.draggable = true;
                dragItem.setAttribute('data-item', item);
                dragItem.textContent = item;
                dragSource.appendChild(dragItem);
            });
            
            // Re-setup drag and drop functionality
            this.setupDragAndDrop(question);
        }
    }

    resetFillBlank(container) {
        const inputs = container.querySelectorAll('.blank-input');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('correct-answer', 'incorrect-answer');
        });
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigation();
            
            // Smooth scroll to top
            document.getElementById('quizContainer').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            this.showToast(`Frage ${this.currentQuestion + 1} geladen`, 'info', 1500);
        } else {
            // Quiz completed
            this.showResults();
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigation();
            
            // Smooth scroll to top
            document.getElementById('quizContainer').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            this.showToast(`Zurück zu Frage ${this.currentQuestion + 1}`, 'info', 1500);
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        // Smooth progress bar animation
        progressBar.style.setProperty('--progress', `${progress}%`);
        progressBar.querySelector('::after').style.width = `${progress}%`;
        
        // Enhanced progress text with percentage
        progressText.textContent = `Frage ${this.currentQuestion + 1} von ${this.questions.length} (${Math.round(progress)}%)`;
        
        // Add completion milestone toasts
        if (progress === 25) {
            this.showToast('25% geschafft! Weiter so! 💪', 'success');
        } else if (progress === 50) {
            this.showToast('Halbzeit erreicht! 🎯', 'success');
        } else if (progress === 75) {
            this.showToast('75% geschafft! Fast am Ziel! 🚀', 'success');
        } else if (progress === 100) {
            this.showToast('Quiz komplett! Zeit für die Auswertung! 🎉', 'success');
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const checkBtn = document.getElementById('checkBtn');
        
        prevBtn.disabled = this.currentQuestion === 0;
        nextBtn.disabled = this.currentQuestion === this.questions.length - 1;
        
        // Enhanced button text based on progress
        if (this.currentQuestion === this.questions.length - 1) {
            nextBtn.textContent = 'Quiz beenden';
            nextBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        } else {
            nextBtn.textContent = 'Weiter';
            nextBtn.style.background = '';
        }
        
        // Update check button with smart text
        const question = this.questions[this.currentQuestion];
        if (question.type === 'drag-drop') {
            checkBtn.textContent = 'Zuordnung prüfen';
        } else if (question.type === 'fill-blank') {
            checkBtn.textContent = 'Eingaben prüfen';
        } else {
            checkBtn.textContent = 'Antworten prüfen';
        }
    }

    calculateScore() {
        let totalQuestions = this.questions.length;
        let correctAnswers = 0;

        this.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            if (!userAnswer) return;

            if (question.type === 'drag-drop') {
                let questionCorrect = true;
                question.zones.forEach(zone => {
                    const userItems = userAnswer[zone.id] || [];
                    const correctItems = zone.items;
                    
                    if (userItems.length !== correctItems.length || 
                        !userItems.every(item => correctItems.includes(item))) {
                        questionCorrect = false;
                    }
                });
                if (questionCorrect) correctAnswers++;
            } else if (question.type === 'multiple-choice') {
                const correctIndices = question.options
                    .map((option, index) => option.correct ? index : -1)
                    .filter(index => index !== -1);
                
                if (userAnswer.length === correctIndices.length && 
                    userAnswer.every(index => correctIndices.includes(index))) {
                    correctAnswers++;
                }
            } else if (question.type === 'true-false-table') {
                let allCorrect = true;
                question.statements.forEach((statement, index) => {
                    if (userAnswer[index] !== statement.correct) {
                        allCorrect = false;
                    }
                });
                if (allCorrect) correctAnswers++;
            } else if (question.type === 'fill-blank') {
                if (userAnswer.trim() === question.answer) {
                    correctAnswers++;
                }
            }
        });

        return { correct: correctAnswers, total: totalQuestions };
    }

    showResults() {
        const score = this.calculateScore();
        const percentage = Math.round((score.correct / score.total) * 100);
        
        document.getElementById('resultsContent').innerHTML = `
            <div class="result-summary">
                <div class="score">${score.correct}/${score.total}</div>
                <p>Sie haben ${percentage}% der Fragen korrekt beantwortet.</p>
                ${percentage >= 70 ? '<p style="color: #4CAF50; font-weight: bold;">🎉 Herzlichen Glückwunsch! Sie haben bestanden!</p>' : 
                  '<p style="color: #f44336; font-weight: bold;">❌ Leider nicht bestanden. Versuchen Sie es erneut!</p>'}
            </div>
        `;
        
        document.getElementById('resultsModal').style.display = 'block';
    }

    showReview() {
        document.getElementById('resultsModal').style.display = 'none';
        alert('Review-Funktion: Hier würden Sie eine detaillierte Übersicht aller Antworten sehen.');
    }

    restart() {
        this.currentQuestion = 0;
        this.userAnswers = {};
        localStorage.removeItem('quizAnswers');
        document.getElementById('resultsModal').style.display = 'none';
        this.renderQuestion();
        this.updateProgress();
        this.updateNavigation();
    }

    saveToLocalStorage() {
        localStorage.setItem('quizAnswers', JSON.stringify(this.userAnswers));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('quizAnswers');
        if (saved) {
            this.userAnswers = JSON.parse(saved);
        }
    }
}

// Initialize quiz when page loads
let quiz;
document.addEventListener('DOMContentLoaded', () => {
    quiz = new QuizApp();
}); 