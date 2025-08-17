import { useState } from 'react'
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
import { Code, Group } from '@mantine/core';
import classes from './navbar.module.css';
import { ProjectSelector } from '~/components/layout/projectSelector/projectSelector'
import { Link, router } from '@inertiajs/react'

const data = [
  { link: '', label: 'Rules', icon: IconSitemap },
  { link: '', label: 'Api', icon: IconApi },
  { link: '', label: 'Activity', icon: IconLogs },
  { link: '', label: 'Billing', icon: IconReceipt2 },
  { link: '', label: 'Authentication', icon: Icon2fa },
  { link: '', label: 'Other Settings', icon: IconSettings },
];

const logout = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  router.get('/logout')
}

export function Navbar() {

  const currentRoute = window.location.pathname

  const [active, setActive] = useState(currentRoute);

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <ProjectSelector/>
          <Code fw={700} className={classes.version}>
            v3.1.2
          </Code>
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
    </nav>
  );
}
