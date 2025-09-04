import React from 'react';
import {
  Card,
  Badge,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  Container,
  SimpleGrid,
  Center,
  Box
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { router } from '@inertiajs/react'

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: 'filled' | 'outline' | 'light';
  onButtonClick?: (plan: string) => void;
  plan: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
                                                   title,
                                                   price,
                                                   description,
                                                   features,
                                                   notIncluded = [],
                                                   popular = false,
                                                   buttonText,
                                                   buttonVariant = 'filled',
                                                   onButtonClick,
                                                   plan,
                                                 }) => {
  return (
    <Card
      withBorder
      radius="md"
      p="xl"
      style={{
        height: '100%',
        position: 'relative',
        border: popular ? '2px solid #228be6' : undefined
      }}
    >
      {popular && (
        <Badge
          variant="filled"
          color="blue"
          size="lg"
          radius="sm"
          style={{
            position: 'absolute',
            top: -1,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          Popular
        </Badge>
      )}

      <Group mt={popular ? 'md' : 0}>
        <Text size="xl" weight={700}>
          {title}
        </Text>
      </Group>

      <Text size="lg" weight={500} mt="md">
        {price}
      </Text>

      <Text size="sm" color="dimmed" mt="xs">
        {description}
      </Text>

      <List
        spacing="sm"
        size="sm"
        mt="lg"
        icon={
          <ThemeIcon color="teal" size={20} radius="xl">
            <IconCheck size={14} />
          </ThemeIcon>
        }
      >
        {features.map((feature, index) => (
          <List.Item key={index}>
            <Text size="sm">{feature}</Text>
          </List.Item>
        ))}
      </List>

      {notIncluded.length > 0 && (
        <List
          spacing="sm"
          size="sm"
          mt="md"
          icon={
            <ThemeIcon color="red" size={20} radius="xl">
              <IconX size={14} />
            </ThemeIcon>
          }
        >
          {notIncluded.map((feature, index) => (
            <List.Item key={index}>
              <Text size="sm" color="dimmed" style={{ textDecoration: 'line-through' }}>
                {feature}
              </Text>
            </List.Item>
          ))}
        </List>
      )}

      <Button
        variant={buttonVariant}
        fullWidth
        mt="xl"
        size="md"
        onClick={() => onButtonClick?.(plan)}
        color={popular ? 'blue' : 'gray'}
      >
        {buttonText}
      </Button>
    </Card>
  );
};

const PricingSection: React.FC = () => {
  const plans = [
    {
      "title": "Basic",
      "price": "Free",
      "description": "Perfect for getting started",
      "features": [
        "Up to 3 projects",
        "Basic support",
        "200k requests/month",
        "Access to essential features"
      ],
      "notIncluded": [
        "Priority support",
        "Advanced analytics",
        "Premium integrations"
      ],
      "buttonText": "You have a free account",
      "buttonVariant": "outline",
      "plan": "free",
    },
    {
      "title": "Pro",
      "price": "€19.99/month",
      "description": "For professionals",
      "features": [
        "Unlimited projects",
        "Priority support",
        "2M requests/month",
        "Advanced analytics",
        "API integrations"
      ],
      "notIncluded": [
        "24/7 dedicated support",
        "Custom training"
      ],
      "popular": true,
      "buttonText": "Subscribe now",
      "buttonVariant": "filled",
      "plan": "premium"
    },
    {
      "title": "Enterprise",
      "price": "Custom",
      "description": "For large enterprises",
      "features": [
        "Unlimited projects",
        "24/7 dedicated support",
        "Unlimited requests",
        "Complete analytics",
        "Premium integrations",
        "Custom training",
        "Guaranteed SLA"
      ],
      "buttonText": "Contact us",
      "buttonVariant": "outline"
    }
  ];

  const handleButtonClick = (plan: string) => {
    console.log('Button clicked for plan:', plan);
    switch (plan) {
      case 'free':
        return
      case 'premium':
        window.location.href = '/billing/subscribe'
        break
      case 'enterprise':
        router.get('/billing/subscribe')
        break
      default:
        return
    }
  }

  return (
    <Container size="lg" py="xl">
      <Center mb="xl">
        <Box style={{ textAlign: 'center' }}>
          <Text size="32px" weight={700} mb="md">
            Chose your plan
          </Text>
          <Text color="dimmed" size="lg">
            Simple and flexible pricing plans to fit your needs.
          </Text>
        </Box>
      </Center>

      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: 'md', cols: 2, spacing: 'md' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
      >
        {plans.map((plan, index) => (
          <PricingCard
            key={index}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            notIncluded={plan.notIncluded}
            popular={plan.popular}
            buttonText={plan.buttonText}
            buttonVariant={plan.buttonVariant}
            onButtonClick={(plan) => handleButtonClick(plan)}
            plan={plan.plan}
          />
        ))}
      </SimpleGrid>

      <Center mt="xl">
        <Text size="sm" color="dimmed">
          All prices are in euros and inclusive of VAT.
        </Text>
      </Center>
    </Container>
  );
};

export default PricingSection;
