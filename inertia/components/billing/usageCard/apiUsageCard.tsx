import { Card, Progress, Text } from '@mantine/core';

type ApiUsageCardProps = {
  maximumCall: number;
  currentCall: number;
};

export function ApiUsageCard(props: ApiUsageCardProps) {

  const percentageUsage = Math.ceil((props.currentCall / props.maximumCall) * 100);

  const formattedCurrentCall = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(props.currentCall);

  const formattedMaximumCall = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(props.maximumCall);

  return (
    <Card withBorder radius="md" padding="xl" bg="var(--mantine-color-body)">
      <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
        Api usage
      </Text>
      <Text fz="lg" fw={500}>
        {formattedCurrentCall} / {formattedMaximumCall}
      </Text>
      <Progress value={percentageUsage} mt="md" size="lg" radius="xl" />
    </Card>
  );
}
