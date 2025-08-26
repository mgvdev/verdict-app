import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@inertiajs/react'

type apiKeyCreationModalProps = {
  createModalOpen: boolean
  handleClose: () => void
}

export function ApiKeyCreationModal({createModalOpen, handleClose}: apiKeyCreationModalProps) {

  const createForm = useForm({
    name: '',
  })

  const handleCreateKey = () => {
    createForm.post('/api_management/api_key', {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  return (
    <Modal
      opened={createModalOpen}
      onClose={handleClose}
      title="Create new API Key"
    >
      <Stack>
        <TextInput
          label="Api Key Name"
          placeholder="Production, Staging, etc."
          value={createForm.data.name}
          onChange={(e) => createForm.setData('name', e.target.value)}
          error={createForm.errors?.name}
        />
        <Button
          loading={createForm.processing}
          onClick={handleCreateKey}
        >
          Create API Key
        </Button>
      </Stack>
    </Modal>
  )

}
