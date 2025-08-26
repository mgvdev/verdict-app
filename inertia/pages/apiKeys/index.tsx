import { AuthLayout } from '~/layouts/authLatout'
import React from 'react'
import { ApiKeyTable } from '~/components/apiKey/apiKeyTable/apiKeyTable'
import ApiKey from '#models/api_key'
import { ApiKeyCreationModal } from '~/components/apiKey/apiKeyCreationModal/apiKeyCreationModal'
import { ApiKeyModal } from '~/components/apiKey/apiKeyModal/apiKeyModal'
import { Button, Flex } from '@mantine/core'

type pageProps = {
  apiKeys: Partial<ApiKey>[]
  flash: {
    apikey: {key: string, secret: string}
  }
}

export function Index({apiKeys, flash}: pageProps) {

  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [apiKeyModalOpen, setApiKeyModalOpen] = React.useState(!!flash.apikey)

  React.useEffect(() => {
    if (flash.apikey) {
      setApiKeyModalOpen(true)
    }
  }, [flash.apikey])

  return (
    <>
      <Flex mt={'lg'} mb={'lg'} justify={'end'}>
        <Button onClick={() => setCreateModalOpen(true)}>Create new API Key</Button>
      </Flex>
      <ApiKeyTable apiKeys={apiKeys} />
      <ApiKeyCreationModal createModalOpen={createModalOpen} handleClose={() => setCreateModalOpen(false)} />
      <ApiKeyModal opened={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} apiKey={{
        token: flash?.apikey?.secret ?? '',
        key: flash?.apikey?.key ?? '',
      }}/>
    </>
  )
}

Index.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Index
