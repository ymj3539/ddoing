import tw, { css, styled, theme } from 'twin.macro'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'third'
  isSmall?: boolean
}

const Button = styled.button(({ variant, isSmall }: ButtonProps) => [
  // The common button styles
  tw`px-8 py-2 rounded transform duration-75`,

  // Use the variant grouping feature to add variants to multiple classes
  tw`hocus:(scale-105 text-yellow-400)`,

  // Use props to conditionally style your components
  variant === 'primary' && tw`bg-black text-white border-black w-60 h-12`,

  // Combine regular css with tailwind classes within backticks
  variant === 'secondary' && [
    css`
      box-shadow: 0 0.1em 0 0 rgba(0, 0, 0, 0.25);
    `,
    tw`border-2 border-yellowL bg-brownL mt-20`,
  ],
  variant === 'third' && tw`bg-none w-60 h-12`,
  // Conditional props can be added
  isSmall ? tw`text-sm` : tw`text-lg`,

  // The theme import can supply values from your tailwind.config.js
  css`
    color: ${theme`colors.white`};
  `,
])

export default Button