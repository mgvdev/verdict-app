import { Modal, Button, Code, Text, Group, Box, CopyButton, Flex } from '@mantine/core'
import { IconCheck, IconCopy, IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

interface ApiKeyModalProps {
  opened: boolean;
  onClose: () => void;
  apiKey: {
    token: string;
    key: string;
  };
}

export function ApiKeyModal({ opened, onClose, apiKey }: ApiKeyModalProps) {
  const [hasConfirmed, setHasConfirmed] = useState(false);


  const handleClose = () => {
    if (!hasConfirmed) {
      // Optional: show warning if trying to close without confirmation
      return;
    }
    setHasConfirmed(false);
    onClose();
  };


  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconAlertCircle size={24} color="orange" />
          <Text fw={700} size="xl">
            API KEY
          </Text>
        </Group>
      }
      size="lg"
      centered
      closeButtonProps={{ disabled: !hasConfirmed }}
    >
      <Box mb="md">
        <Text size="sm" mb="sm">
          Your api key is only displayed once. Please save it in a secure place.
        </Text>

      </Box>

      <Box mb="xl">
        <Text size="sm" fw={500} mb="xs">
          API Key :
        </Text>
        <Code block style={{ position: 'relative', paddingRight: 60 }}>
          <Flex gap={'md'}>
            <p style={{overflow: 'scroll', whiteSpace: 'nowrap', width: '92%'}}>
              {apiKey.token}
            </p>
            <CopyButton value={apiKey.token} timeout={2000}>
              {({ copied, copy }) => (
                <Button
                  size="xs"
                  variant="light"
                  style={{ position: 'absolute', right: 8, top: 8 }}
                  onClick={copy}
                  leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </CopyButton>
          </Flex>
        </Code>
      </Box>

      <Box mb="xl">
        <Text size="sm" fw={500} mb="xs">
          Key identification :
        </Text>
        <Code>{apiKey.key}</Code>
      </Box>

      <Box>
        <Text size="sm" c="dimmed" mb="md">
          ⚠️ For security reasons, <strong>do not share</strong> this key with anyone. This key appears only once here.
        </Text>
      </Box>

      <Group justify="center">
        <Button
          color={hasConfirmed ? 'red' : 'green'}
          onClick={() => hasConfirmed ? handleClose() : setHasConfirmed(true)}
          leftSection={<IconCheck size={16} />}
        >
          {hasConfirmed ? 'Close ?' : 'I saved the key'}
        </Button>
      </Group>
    </Modal>
  );
}
