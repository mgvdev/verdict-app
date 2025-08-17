import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Navbar } from '~/components/layout/navbar/navbar'
import { GlobalContextProvider } from '~/contexts'

export function AuthLayout({ children }: { children: React.ReactNode }) {

  const [opened, {toggle}] = useDisclosure();

  return (
    <GlobalContextProvider>
      <AppShell
        padding="md"
        layout="alt"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened }
        }}
      >
        <AppShell.Header>
            <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm'/>
        </AppShell.Header>

        <AppShell.Navbar zIndex={200}>
          <Navbar/>
        </AppShell.Navbar>

        <AppShell.Main>
          {children}
        </AppShell.Main>

      </AppShell>
    </GlobalContextProvider>
  );
}
