import { ProjectProvider } from '~/contexts/projectContext'

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectProvider>{children}</ProjectProvider>
    </>
  )
}
