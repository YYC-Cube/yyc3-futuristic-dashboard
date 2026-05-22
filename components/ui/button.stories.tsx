import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    asChild: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: "Button",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  }
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  }
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  }
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  }
}

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  }
}

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  }
}

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  }
}

export const Icon: Story = {
  args: {
    size: "icon",
    children: "🔔",
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  }
}

export const WithLoading: Story = {
  render: (args) => (
    <Button {...args} disabled>
      <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </Button>
  ),
}
