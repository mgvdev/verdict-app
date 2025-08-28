import ApiKey from '#models/api_key'
import { Button, Table } from '@mantine/core'
import { router } from '@inertiajs/react'

type apiKeyTableProps = {
  apiKeys: Partial<ApiKey>[]
}

export function ApiKeyTable({ apiKeys }: apiKeyTableProps) {

  return (
    <>
      <Table>
        <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Key</Table.Th>
              <Table.Th>Created at</Table.Th>
              <Table.Th>Created by</Table.Th>
              <Table.Th>Last used</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {apiKeys.map((apiKey) => (
            <ApiKeyListItem key={apiKey.id} {...apiKey} />
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}


function ApiKeyListItem(apiKey: Partial<ApiKey>) {

  const createdAt = new Date(apiKey.createdAt as unknown as string).toLocaleString()
  const lastUsedAt =  apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt as unknown as string).toLocaleString() : 'Never'
  const revokedAt =  apiKey.deletedAt ? new Date(apiKey.deletedAt as unknown as string).toLocaleString() : ''
  const isRevoked = apiKey.deletedAt !== null

  return (
    <>
      <Table.Tr style={{ opacity: isRevoked ? 0.5 : 1, textDecoration: isRevoked ? 'line-through' : 'none' }}>
        <Table.Td>{apiKey.name}</Table.Td>
        <Table.Td>{apiKey.apiKey}</Table.Td>
        <Table.Td>{createdAt}</Table.Td>
        <Table.Td>{apiKey.createdBy?.fullName ?? apiKey.createdBy?.email}</Table.Td>
        <Table.Td>{lastUsedAt}</Table.Td>
        <Table.Td>
          {!isRevoked && (
            <Button color={'red'}
              onClick={() => router.delete(`api_management/api_key/${apiKey.id}`)}
            >Revoke</Button>
          )}
          {isRevoked && (
            <><span>Revoked at : {revokedAt}</span></>
          )}

        </Table.Td>
      </Table.Tr>
    </>
  )
}
