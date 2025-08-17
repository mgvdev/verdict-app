import { Head } from '@inertiajs/react'
import { Button } from '@mantine/core'

export default function Home() {
  return (
    <>
      <Head title="Homepage" />
      <div>
        <Button variant="filled">Default</Button>
      </div>
    </>
  )
}
