import { NumberInput, Select, TextInput } from '@mantine/core'
import { ScalarType } from '~/components/rules/ruleBuilder/types'
import { match } from 'ts-pattern'
import { DateInput } from '@mantine/dates'
import { isDateLike } from '~/components/rules/ruleBuilder/utils'

/**
 * ValueInput
 *
 * @param scalar
 * @param value
 * @param onChange
 * @constructor
 */
export function ValueInput({
  scalar,
  value,
  onChange,
}: {
  scalar: ScalarType | undefined
  value: any
  onChange: (v: any) => void
}) {
  return match(scalar)
    .with('number', () => (
      <NumberInput
        value={typeof value === 'number' ? value : undefined}
        onChange={(v) => onChange(typeof v === 'number' ? v : undefined)}
        placeholder="Number"
        w={220}
      />
    ))
    .with('boolean', () => (
      <Select
        w={220}
        data={[
          { label: 'true', value: 'true' },
          { label: 'false', value: 'false' },
        ]}
        value={typeof value === 'boolean' ? String(value) : undefined}
        onChange={(v) => onChange(v === 'true')}
        placeholder="Boolean"
      />
    ))
    .with('date', () => (
      <DateInput
        value={value instanceof Date ? value : isDateLike(value) ? new Date(value) : null}
        onChange={(d) => onChange(d ?? undefined)}
        w={240}
        placeholder="Pick a date"
        clearable
      />
    ))
    .otherwise(() => (
      <TextInput
        w={260}
        placeholder="Value"
        value={value ?? ''}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    ))
}
