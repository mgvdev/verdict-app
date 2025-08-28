import { useMemo, useState } from 'react'
import {
  Icon2fa,
  IconApi,
  IconLogout,
  IconLogs,
  IconReceipt2,
  IconSettings,
  IconSitemap,
  IconSwitchHorizontal,
} from '@tabler/icons-react'
import { Code, Group } from '@mantine/core'
import classes from './navbar.module.css'
import { ProjectSelector } from '~/components/layout/projectSelector/projectSelector'
import { Link, router, usePage } from '@inertiajs/react'

const data = [
  { link: '/rules', label: 'Rules', icon: IconSitemap },
  { link: '/api_management', label: 'Api', icon: IconApi },
  { link: '/activities', label: 'Activity', icon: IconLogs },
  { link: '/billing', label: 'Billing', icon: IconReceipt2 },
  { link: '/authentication', label: 'Authentication', icon: Icon2fa },
  { link: '/settings', label: 'Other Settings', icon: IconSettings },
]

const logout = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  router.get('/logout')
}

export function Navbar() {
  const currentRoute = window.location.pathname

  const props = usePage().props

  const active = useMemo(() => {
    return currentRoute
  }, [currentRoute])

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={active.startsWith(item.link) || undefined}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <ProjectSelector />

        </Group>
        {links}
      </div>

      <div className={classes.footer}>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={logout}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>

      <Code fw={700} className={classes.version} ml={'auto'}>
        { props.app_version as React.ReactNode }
      </Code>
    </nav>
  )
}
