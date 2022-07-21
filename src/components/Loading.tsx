
import { Center, Spinner, Text, VStack } from 'native-base'

export function Loading() {
  return (
    <Center flex={1} bg="gray.700">
      <VStack>
        <Spinner color="secondary.700" />
        <Text color='gray.200'> Carregando conteúdo</Text>
      </VStack>
    </Center>
  )
}