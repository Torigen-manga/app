import type { UITexts } from "./types";

const pt_lang: UITexts = {
	extensions: {
		title: "Extensões",
	},
	search: {
		title: "Pesquisar",
	},
	explore: {
		title: "Explorar",
		home: "Início",
	},
	mangaDetails: {
		genres: "Gêneros",
		authors: "Autores",
		artists: "Artistas",
		description: "Descrição",
		chaptersTable: {
			camps: {
				title: "Capítulos",
				releasedSince: "Lançados desde",
				actions: {
					title: "Ações",
				},
			},
		},
		addToLibrary: {
			title: "Adicionar à Biblioteca",
			description: "Adicione este mangá à sua biblioteca para fácil acesso.",
			addToCategory: {
				checkbox: "Adicionar a uma categoria",
				label: "Categoria",
				placeholder: "Selecione ou crie uma categoria",
				newCategory: {
					label: "Nova Categoria",
					placeholder: "Digite o nome da nova categoria",
				},
			},
			options: {
				add: "Adicionar",
				cancel: "Cancelar",
			},
		},
		removeFromLibrary: {
			title: "Remover da Biblioteca",
			description:
				"Você tem certeza que deseja remover este mangá da sua biblioteca?",
			options: {
				confirm: "Remover",
				cancel: "Cancelar",
			},
		},
	},
	sidebar: {
		main: {
			home: "Início",
			search: "Pesquisar",
			explore: "Explorar",
			library: "Biblioteca",
			extensions: "Extensões",
			settings: "Configurações",
		},
		explore: {
			title: "Explorar",
			home: "Início",
		},
		settings: {
			layout: "Layout",
			reader: "Leitor",
			libraryHistory: "Biblioteca e Histórico",
			systemBehavior: "Comportamento do Sistema",
			experimental: "Funcionalidades Experimentais",
		},
	},
	settings: {
		layout: {
			title: "Layout",
			description:
				"Configurações relacionadas ao layout da interface do usuário.",
			options: {
				themeMode: {
					title: "Tema",
					description: "Escolha o modo de tema para a interface.",
				},
				appTheme: {
					title: "Cores",
					description: "Escolha as cores para a interface.",
				},
				coverStyle: {
					title: "Estilo da Capa",
					description: "Escolha o estilo da capa para a interface.",
				},
				showTitles: {
					title: "Exibir Títulos",
					description: "Exibir títulos de mangás abaixo das capas.",
				},
				compactMode: {
					title: "Modo Compacto",
					description: "Ativar modo compacto para uma interface mais enxuta.",
				},
				showReadIndicator: {
					title: "Indicador de Leitura",
					description: "Exibir um indicador de capítulos lidos na biblioteca.",
				},
			},
		},
		reader: {
			title: "Leitor",
			description: "Configurações relacionadas ao leitor de mangás.",
			options: {
				pageLayout: {
					title: "Layout da Página",
					description: "Escolha o layout da página para leitura.",
				},
				zoomBehavior: {
					title: "Comportamento de Zoom",
					description: "Escolha como o zoom deve se comportar no leitor.",
				},
				zoomLevel: {
					title: "Nível de Zoom",
					description: "Defina o nível de zoom padrão para o leitor.",
				},
				readingDirection: {
					title: "Direção de Leitura",
					description:
						"Escolha a direção de leitura (esquerda para direita ou direita para esquerda).",
				},
				rememberZoom: {
					title: "Lembrar Zoom",
					description: "Lembrar o nível de zoom entre as leituras.",
				},
			},
		},
		libraryHistory: {
			title: "Biblioteca e Histórico",
			description:
				"Configurações relacionadas à biblioteca e histórico de leitura.",
			options: {
				enableHistory: {
					title: "Habilitar Histórico",
					description:
						"Ativar o histórico de leitura para rastrear o progresso.",
				},
				maxHistoryEntries: {
					title: "Máximo de Entradas no Histórico",
					description:
						"Defina o número máximo de entradas no histórico de leitura.",
				},
				showRecentlyRead: {
					title: "Exibir Recentemente Lidos",
					description: "Exibir mangás recentemente lidos na biblioteca.",
				},
			},
		},
		systemBehavior: {
			title: "Comportamento do Sistema",
			description: "Configurações relacionadas ao comportamento do sistema.",
			options: {
				checkNewChaptersOnStartup: {
					title: "Verificar Novos Capítulos ao Iniciar",
					description:
						"Verificar automaticamente novos capítulos ao iniciar o aplicativo.",
				},
				confirmBeforeRemovingManga: {
					title: "Confirmar Antes de Remover Mangá",
					description:
						"Solicitar confirmação antes de remover um mangá da biblioteca.",
				},
				enableNotifications: {
					title: "Habilitar Notificações",
					description:
						"Ativar notificações para novos capítulos e atualizações.",
				},
			},
		},
		experimental: {
			title: "Funcionalidades Experimentais",
			description:
				"Configurações relacionadas a funcionalidades experimentais.",
			options: {
				enableCustomSources: {
					title: "Habilitar Fontes Personalizadas",
					description: "Ativar a adição de fontes personalizadas para mangás.",
				},
				enableDebugLogging: {
					title: "Habilitar Registro de Depuração",
					description:
						"Ativar o registro de depuração para solucionar problemas.",
				},
				hardwareAcceleration: {
					title: "Aceleração de Hardware",
					description: "Ativar aceleração de hardware para melhor desempenho.",
				},
			},
		},
	},
	error: {
		notFound: "Página não encontrada",
		networkError: "Erro de rede",
		unauthorized: "Não autorizado",
		unknownError: "Erro desconhecido",
	},
	library: {
		title: "Biblioteca",
		menu: {
			addCategory: {
				menuTitle: "Adicionar Categoria",
				title: "Adicionar Nova Categoria",
				description: "Crie uma nova categoria para organizar seus mangás.",
			},
			reorder: "Reordenar",
		},
		categoryMenu: {
			edit: "Editar",
			delete: "Excluir",
		},
		empty: "Sua biblioteca está vazia.",
	},
};

export { pt_lang };
