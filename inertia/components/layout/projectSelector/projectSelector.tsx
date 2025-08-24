import { Avatar, Group, Text, UnstyledButton } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import classes from './projectSelector.module.css'
import { useProject } from '~/contexts/projectContext'
import { Acronym } from '~/utils/str'

export function ProjectSelector() {
  const project = useProject()
  const acronym = Acronym(project.name)

  return (
    <UnstyledButton className={classes.selector}>
      <Group>
        <Avatar color="blue" radius="xl">
          {acronym}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {project.name}
          </Text>
          <Text c="dimmed" size="xs">
            {project.description}
          </Text>
        </div>
        <IconChevronRight />
      </Group>
    </UnstyledButton>
  )
}
