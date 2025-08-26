import { AuthLayout } from '~/layouts/authLatout'
import React from 'react'
import { ApiKeyTable } from '~/components/apiKey/apiKeyTable/apiKeyTable'
import ApiKey from '#models/api_key'

type pageProps = {
  apiKeys: Partial<ApiKey>[]
}

export function Index({apiKeys}: pageProps) {

  return (
    <>
      <ApiKeyTable apiKeys={apiKeys} />
    </>
  )
}

Index.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Index
