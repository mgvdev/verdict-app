import { createContext, useContext } from 'react'
import { usePage } from '@inertiajs/react'

type ProjectContextType = {
  name: string
  description: string
  switchProject: (id: string) => void
}

export const ProjectContext = createContext<ProjectContextType>({
  name: '',
  description: '',
  switchProject: () => {},
})

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const pageProps = usePage<{ currentProject: ProjectContextType }>().props
  const { currentProject } = pageProps

  return (
    <ProjectContext.Provider
      value={{
        name: currentProject.name,
        description: currentProject.description,
        switchProject: () => {},
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => {
  return useContext(ProjectContext)
}
