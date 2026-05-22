import type { Preview } from "@storybook/react"
import "../app/globals.css"

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0f172a" },
        { name: "light", value: "#ffffff" },
        { name: "slate-800", value: "#1e293b" },
        { name: "slate-900", value: "#0f172a" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-slate-900 min-h-screen">
        <Story />
      </div>
    ),
  ],
}

export default preview
