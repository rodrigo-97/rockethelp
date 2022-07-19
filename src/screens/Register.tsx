import { VStack } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-tools';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Header } from '../components/Header';

export function Register() {
  return (
    <VStack flex={1} p={6} bg="gray.600">
      <KeyboardAwareScrollView>
        <Header
          title='Nova Solicitação'
        />

        <Input
          placeholder='Número do patrimônio'
          mt={4}
        />

        <Input
          placeholder='Descrição do problema'
          flex={1}
          mt={5}
          multiline
          textAlignVertical="top"
          mb={5}
          h={200}
        />

        <Button title='Enviar' />
      </KeyboardAwareScrollView>
    </VStack>
  );
}