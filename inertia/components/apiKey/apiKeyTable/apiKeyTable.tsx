import ApiKey from '#models/api_key'
import { Button, Table } from '@mantine/core'

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

  return (
    <>
      <Table.Tr>
        <Table.Td>{apiKey.name}</Table.Td>
        <Table.Td>{apiKey.apiKey}</Table.Td>
        <Table.Td>{createdAt}</Table.Td>
        <Table.Td>{apiKey.createdBy?.fullName ?? apiKey.createdBy?.email}</Table.Td>
        <Table.Td>{lastUsedAt}</Table.Td>
        <Table.Td>
          <Button>Edit</Button>
        </Table.Td>
      </Table.Tr>
    </>
  )
}
