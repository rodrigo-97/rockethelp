import { Input as NativeBaseInput, IInputProps } from 'native-base';

type Props = IInputProps & {
  hasError?: boolean
}

export function Input({ hasError = false, ...rest }: Props) {
  return (
    <NativeBaseInput
      bg="gray.700"
      h={14}
      size="md"
      borderWidth={hasError ? 1 : 0}
      fontSize="md"
      fontFamily="body"
      placeholderTextColor='gray.300'
      color='gray.100'
      _focus={{
        borderWidth: 1,
        borderColor: "green.500",
        bg: "gray.700",
      }}
      {...rest}
    />
  );
}