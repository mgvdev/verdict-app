import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'


export function AuthLayout({ children }: { children: React.ReactNode }) {

  const [opened, {toggle}] = useDisclosure();


  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
    >
      <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm'/>
          <div>Header</div>
        </AppShell.Header>

      <AppShell.Navbar>
        <div>Navbar</div>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>

    </AppShell>
  );
}
