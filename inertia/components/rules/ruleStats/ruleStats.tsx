import {
  Box,
  Center,
  Group,
  Loader,
  Paper,
  RingProgress,
  SimpleGrid,
  Text,
} from '@mantine/core'
import { GetRuleStatsResponse } from '#services/api_stat_service'
import { match } from 'ts-pattern'


type statsRingProps = {
  ruleStats?: GetRuleStatsResponse,
  loading: boolean,
}

export function StatsRing({ruleStats, loading}: statsRingProps) {

  const truePercentage =  ruleStats?.total_count ? (ruleStats.true_count / ruleStats.total_count) * 100 : 0;

  return <Box>
    <SimpleGrid cols={{ base: 1, sm: 3 }}>

      <Paper withBorder radius="md" p="xs">
        {
          match(loading)
            .with(true, () => <Center><Loader color={'blue'}></Loader></Center>)
            .with(false, () => <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: truePercentage ?? 0, color: 'blue' }]}
              />

              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  Call evaluated to true
                </Text>
                <Text fw={700} size="xl">
                  {ruleStats?.true_count} / {ruleStats?.total_count}
                </Text>
              </div>
            </Group>)
            .exhaustive()
        }

      </Paper>

    </SimpleGrid>
  </Box>
}
