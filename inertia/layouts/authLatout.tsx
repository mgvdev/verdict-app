import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Navbar } from '~/components/layout/navbar/navbar'
import { GlobalContextProvider } from '~/contexts'
import {usePage} from "@inertiajs/react";
import {useEffect} from "react";
import {notifications} from "@mantine/notifications";

export function AuthLayout({ children }: { children: React.ReactNode }) {


  /**
   * Notification trigger when a flash message with notification is present
   */
  const {flash} = usePage().props as { notification?: { title: string, message: string, type: string }}

  useEffect(() => {
    if (!flash?.notification) return;

    notifications.show({
      title: flash?.notification?.title ?? 'Notification',
      message: flash?.notification?.message ?? '',
      color: flash?.notification?.type,
    });

  }, [flash.notification]);

  /**
   * Navbar toggle hook
   */
  const [opened, { toggle }] = useDisclosure()


  return (
    <GlobalContextProvider>
      <AppShell
        padding="md"
        layout="alt"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </AppShell.Header>

        <AppShell.Navbar zIndex={200}>
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </GlobalContextProvider>
  )
}
