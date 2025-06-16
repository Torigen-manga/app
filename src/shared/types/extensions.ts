interface Registry {
  [key: string]: {
    name: string
    path: string
    version: string
    main: string
    dependencies?: string[]
  }
}

export type { Registry }
